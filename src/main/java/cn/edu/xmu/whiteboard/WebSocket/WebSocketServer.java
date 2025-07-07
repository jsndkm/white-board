package cn.edu.xmu.whiteboard.WebSocket;

import cn.edu.xmu.whiteboard.WebSocket.pojo.WebSocketMessage;
import cn.edu.xmu.whiteboard.controller.dto.pb.ElementDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardDto;
import cn.edu.xmu.whiteboard.redis.PointerKey;
import cn.edu.xmu.whiteboard.redis.RedisService;
import cn.edu.xmu.whiteboard.service.ProjectBoardService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import com.google.common.util.concurrent.RateLimiter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;

import java.util.concurrent.CopyOnWriteArraySet;

import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

@ServerEndpoint(value = "/ws")
@Component
public class WebSocketServer {
    private final static Logger log = LoggerFactory.getLogger(WebSocketServer.class);

    private RedisService getRedisService() {
        return SpringContextHolder.getBean(RedisService.class);
    }
    private ProjectBoardService getProjectBoardService() {
        return SpringContextHolder.getBean(ProjectBoardService.class);
    }
    // 用于生成服务器端时间戳
    private static final AtomicLong timestampGenerator = new AtomicLong(System.currentTimeMillis());

    // 待处理消息队列（按timestamp排序）
    private final PriorityBlockingQueue<PendingMessage> messageQueue = new PriorityBlockingQueue<>(11,
            Comparator.comparingLong(msg -> msg.timestamp));
    // 使用更高效的消息队列和处理机制
    private static final ExecutorService messageExecutor = Executors.newWorkStealingPool();
    private static final RateLimiter rateLimiter = RateLimiter.create(1000); // 限流

    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static CopyOnWriteArraySet<WebSocketServer> webSocketSet = new CopyOnWriteArraySet<WebSocketServer>();
    // 房间信息：roomId -> RoomInfo
    private static final ConcurrentMap<String, RoomInfo> roomMap = new ConcurrentHashMap<>();
    // 用户会话：username -> WebSocketServer
    private static final ConcurrentMap<String, WebSocketServer> userSessionMap = new ConcurrentHashMap<>();
    // 项目画板：roomId -> ProjectBoard
    // 使用AtomicReference保证projectBoardDto的原子更新
    private static final ConcurrentMap<String, ProjectBoardDto> projectBoardMap = new ConcurrentHashMap<>();

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;
    // 当前房间ID
    private String currentRoomId;
    //当前用户名
    private String currentUsername;
    // 标记是否正在处理消息，防止重复处理
    private volatile boolean isProcessing = false;

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        //加入set中
        webSocketSet.add(this);
        log.info("有新连接加入！当前在线人数为" + webSocketSet.size());
        log.info("user connect success!");
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        messageQueue.removeIf(msg -> msg.sender == this);
        if(currentRoomId != null&&currentUsername!=null) {
            RoomInfo room = roomMap.get(currentRoomId);
            if(room!=null) {
                room.removeUser(currentUsername);
                roomMap.put(room.roomId, room);
            }
            userSessionMap.remove(currentUsername);
            WebSocketMessage.RoomUserChangeData userChangeData = new WebSocketMessage.RoomUserChangeData();
            userChangeData.setUsername(currentUsername);
            userChangeData.setAction("leave");
            broadcastToRoom(currentRoomId, "room-user-change", userChangeData, timestampGenerator.getAndIncrement());
            log.info(currentUsername + "离开房间:" + currentRoomId);
            //从set中删除
            webSocketSet.remove(this);
            log.info("连接关闭！当前在线人数为" + webSocketSet.size());
            log.info(currentUsername + "断开连接");
        }
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        //log.info("来自客户端的消息:" + message);

        try {
            JSONObject json = JSON.parseObject(message);
            String type = json.getString("type");
            JSONObject data = json.getJSONObject("data");
            long timestamp = json.getLongValue("timestamp");

            // 如果客户端没有提供timestamp，使用服务器时间
            if (timestamp <= 0) {
                timestamp = timestampGenerator.getAndIncrement();
            }

            // 将消息加入队列
            messageQueue.put(new PendingMessage(type, data, timestamp, this));

            // 如果没有在处理消息，则启动处理
            if (!isProcessing) {
                processMessages();
            }
        } catch (Exception e) {
            log.error("消息处理错误: " + e.getMessage());
        }
    }

    // 处理消息队列中的消息
    private void processMessages() {
        if (isProcessing) {
            return;
        }

        isProcessing = true;
        CompletableFuture.runAsync(() -> {
            try {
                List<PendingMessage> batch = new ArrayList<>();
                messageQueue.drainTo(batch, 100); // 批量处理

                batch.parallelStream().forEach(msg -> {
                    if (!rateLimiter.tryAcquire()) {
                        return; // 限流
                    }

                    try {
                        handleMessage(msg.type, msg.data, msg.timestamp,
                                timestampGenerator.getAndIncrement());
                    } catch (Exception e) {
                        log.error("消息处理错误", e);
                    }
                });
            } finally {
                isProcessing=false;
                if (!messageQueue.isEmpty()) {
                    processMessages();
                }
            }
        }, messageExecutor);
    }

    // 处理具体消息
    private void handleMessage(String type, JSONObject data, long originalTimestamp, long responseTimestamp) {
        try {
            switch (type) {
                case "join-room":
                    handleJoinRoom(data, responseTimestamp);
                    break;
                case "client-broadcast":
                    handleServerBroadcast(data, responseTimestamp);
                    break;
                case "client-pointer-broadcast":
                    handleServerPointerBroadcast(data, responseTimestamp);
                    break;
                case "disconnecting":
                    handleDisconnecting(data, responseTimestamp);
                    break;
                default:
                    log.error("未知消息类型: " + type);
            }
        } catch (Exception e) {
            log.error("消息处理错误: " + e.getMessage());
        }
    }

    /**
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("发生错误");
        error.printStackTrace();
    }

    // 发送消息（包含时间戳）
    public void sendMessage(String type, Object data, long responseTimestamp) throws IOException {
        WebSocketMessage response = new WebSocketMessage();
        response.setType(type);
        response.setData(data);
        response.setTimestamp(responseTimestamp); // 使用服务器生成的时间戳

        String message = JSON.toJSONString(response);
        this.session.getBasicRemote().sendText(message);
    }

    // 发送错误消息（包含时间戳）
    private void sendError(String errorMessage, long responseTimestamp) {
        System.out.println(errorMessage+":"+responseTimestamp);
        log.error(errorMessage);
    }

    // 内部类表示房间信息
    private static class RoomInfo {
        private final String roomId;
        private final CopyOnWriteArraySet<String> users = new CopyOnWriteArraySet<>();

        public RoomInfo(String roomId) {
            this.roomId = roomId;
        }

        public String getRoomId() {
            return roomId;
        }

        public CopyOnWriteArraySet<String> getUsers() {
            return users;
        }

        public void addUser(String username) {
            users.add(username);
        }

        public boolean removeUser(String username) {
            return users.remove(username);
        }
    }

    // 内部类表示待处理消息
    private static class PendingMessage {
        String type;
        JSONObject data;
        long timestamp;
        WebSocketServer sender;

        public PendingMessage(String type, JSONObject data, long timestamp, WebSocketServer sender) {
            this.type = type;
            this.data = data;
            this.timestamp = timestamp;
            this.sender = sender;
        }
    }

    // 处理服务器广播
    private void handleServerBroadcast(JSONObject data,long responseTimestamp) {
        WebSocketMessage.ServerBroadcastData request = data.toJavaObject(WebSocketMessage.ServerBroadcastData.class);
        if(request.getProjectId()<0)
        {
            sendError("项目ID无效",responseTimestamp);
            return;
        }
        String roomId = "Room" + request.getProjectId();

        // 使用computeIfAbsent和乐观锁
        ProjectBoardDto newBoard = projectBoardMap.compute(roomId, (k, existing) -> {
                    ProjectBoardDto current = existing != null ? existing : new ProjectBoardDto();
                    ProjectBoardDto updated = new ProjectBoardDto();
                    BeanUtils.copyProperties(current, updated);

                    // 高效合并元素
                    Map<String, ElementDto> elementMap = new ConcurrentHashMap<>();
                    if (current.getElements() != null) {
                        Arrays.stream(current.getElements())
                                .filter(e -> e.getId() != null)
                                .forEach(e -> elementMap.put(e.getId(), e));
                    }
            if (request.getElements() != null) {
                Arrays.stream(request.getElements())
                        .filter(e -> e.getId() != null)
                        .forEach(newElement -> {
                            ElementDto existingElement = elementMap.get(newElement.getId());
                            if (existingElement == null || newElement.getVersion() > existingElement.getVersion()) {
                                elementMap.put(newElement.getId(), newElement);
                            }
                        });
            }

            updated.setElements(elementMap.values().toArray(new ElementDto[0]));
            updated.setAppState(current.getAppState());
            updated.setFiles(request.getFile());
            return updated;
        });

        // 异步存储到数据库
        CompletableFuture.runAsync(() -> {
            ProjectBoardService projectBoardService = getProjectBoardService();
            projectBoardService.storeProjectBoard(newBoard, request.getProjectId());
        });

        // 广播给房间内所有用户
        RoomInfo roomInfo = roomMap.get(roomId);
        if (roomInfo != null) {
            WebSocketMessage.ClientBroadcastData response = new WebSocketMessage.ClientBroadcastData();
            response.setElements(projectBoardMap.get(roomId).getElements());
            response.setFile(request.getFile());

            broadcastToRoomExcludingUser(roomId, "server-broadcast", response, responseTimestamp, request.getUsername());
        } else {
            sendError("房间不存在",responseTimestamp);
        }
    }

    // 处理服务器光标广播
    private void handleServerPointerBroadcast(JSONObject data,long responseTimestamp) {
        WebSocketMessage.ServerPointerBroadcastData request = data.toJavaObject(WebSocketMessage.ServerPointerBroadcastData.class);

        if(request.getProjectId()<0)
        {
            sendError("项目ID无效",responseTimestamp);
            return;
        }
        String roomId = "Room" + request.getProjectId();

        // 存储当前用户的指针位置到 Redis
        String userPointerKey = request.getUsername() + ":pointer";

        // 构造 PointerInfo 并存入 Redis
        WebSocketMessage.PointerInfo ptrInfo = new WebSocketMessage.PointerInfo();
        ptrInfo.setUsername(request.getUsername());
        ptrInfo.setX(request.getX());
        ptrInfo.setY(request.getY());

        RedisService redisService = getRedisService(); // 动态获取 RedisService
        boolean result = redisService.set(PointerKey.getByHash, userPointerKey, ptrInfo);
        if (!result) {
            throw new RuntimeException("Failed to store pointer data");
        }

        // 广播给房间内所有用户
        RoomInfo roomInfo = roomMap.get(roomId);
        if (roomInfo != null) {
            WebSocketMessage.ClientPointerBroadcastData response = new WebSocketMessage.ClientPointerBroadcastData();
            response.setProjectId(request.getProjectId());

            List<WebSocketMessage.PointerInfo> pointerInfos = new ArrayList<>();
            // 获取房间所有用户
            for (String username : roomInfo.getUsers()) {
                String userRedisKey = username + ":pointer";

                // 从 Redis 获取该用户的指针信息
                WebSocketMessage.PointerInfo storedPointer=redisService.get(PointerKey.getByHash, userRedisKey, WebSocketMessage.PointerInfo.class);

                if (storedPointer != null) {
                    pointerInfos.add(storedPointer);
                }
            }
            response.setUsers(pointerInfos);

            broadcastToRoomExcludingUser(roomId, "server-pointer-broadcast", response, responseTimestamp, request.getUsername());
        } else {
            sendError("房间不存在",responseTimestamp);
        }
    }

    // 向指定房间广播消息
    private void broadcastToRoom(String roomId, String type, Object data,long responseTimestamp) {
        RoomInfo roomInfo = roomMap.get(roomId);
        if (roomInfo != null) {
            roomInfo.getUsers().forEach(username -> {
                WebSocketServer client = userSessionMap.get(username);
                if (client != null) {
                    try {
                        client.sendMessage(type,data,responseTimestamp);
                    } catch (IOException e) {
                        log.error("发送消息给用户 {} 失败", username, e);
                    }
                }
            });
        }
    }

    // 向指定房间广播消息（排除指定用户）
    private void broadcastToRoomExcludingUser(String roomId, String type, Object data, long responseTimestamp, String excludeUsername) {
        RoomInfo roomInfo = roomMap.get(roomId);
        if (roomInfo != null) {
            roomInfo.getUsers().forEach(username -> {
                // 跳过排除的用户
                if (username.equals(excludeUsername)) {
                    return;
                }

                WebSocketServer client = userSessionMap.get(username);
                if (client != null) {
                    try {
                        client.sendMessage(type, data, responseTimestamp);
                    } catch (IOException e) {
                        log.error("发送消息给用户 {} 失败", username, e);
                    }
                }
            });
        }
    }

    private void initRoom(String username, int projectId,long responseTimestamp){
        //生成roomId
        String roomId = "Room" + projectId;
        this.currentRoomId = roomId;
        this.currentUsername=username;
        projectBoardMap.put(roomId, new ProjectBoardDto());
        RoomInfo roomInfo = new RoomInfo(roomId);
        roomInfo.addUser(username);
        roomMap.put(roomId,roomInfo);

        WebSocketMessage.InitRoomData data = new WebSocketMessage.InitRoomData();
        data.setRoomId(roomId);

        broadcastToRoom(roomId,"init-room",data,responseTimestamp);
    }

    private void handleJoinRoom(JSONObject data,long responseTimestamp){
        WebSocketMessage.JoinRoomData request = data.toJavaObject(WebSocketMessage.JoinRoomData.class);
        String user = request.getUsername();
        if(user == null){
            sendError("用户名不能为空",responseTimestamp);
            return;
        }
        userSessionMap.put(user,this);
        if(request.getProjectId()>0) {
            if(currentRoomId!=null&&!currentRoomId.isEmpty()){
                RoomInfo tmp = roomMap.get(currentRoomId);
                tmp.removeUser(user);
                roomMap.put(currentRoomId,tmp);
                WebSocketMessage.RoomUserChangeData userChangeData = new WebSocketMessage.RoomUserChangeData();
                userChangeData.setUsername(user);
                userChangeData.setAction("leave");
                broadcastToRoom(currentRoomId,"room-user-change",userChangeData,responseTimestamp);
                log.info(user+"离开房间:"+currentRoomId);
            }
            RoomInfo room = roomMap.get("Room"+request.getProjectId());
            if(room==null){
                initRoom(user,request.getProjectId(),responseTimestamp);
            }
            else {
                currentRoomId = room.roomId;
                currentUsername=user;
                room.addUser(user);
                roomMap.put(room.roomId,room);
            }

            WebSocketMessage.RoomUserChangeData Data = new WebSocketMessage.RoomUserChangeData();
            Data.setUsername(user);
            Data.setAction("join");
            broadcastToRoom(currentRoomId,"room-user-change",Data,responseTimestamp);
            log.info(user+"加入房间:"+currentRoomId);
        }
        else {
            sendError("项目ID无效",responseTimestamp);
        }
    }

    private void handleDisconnecting(JSONObject data,long responseTimestamp){
        WebSocketMessage.DisconnectingData request = data.toJavaObject(WebSocketMessage.DisconnectingData.class);
        String user = request.getUsername();
        int projectId= request.getProjectId();
        String roomId="Room"+projectId;
        if(user == null){
            sendError("用户名不能为空",responseTimestamp);
            return;
        }
        if(projectId<0){
            sendError("项目ID无效",responseTimestamp);
            return;
        }
        WebSocketMessage.DisconnectData disconnectData = new WebSocketMessage.DisconnectData();
        disconnectData.setUsername(user);
        disconnectData.setIsExpected(true);

        try {
            onClose();
        } catch (Exception e) {
            log.error("webSocket disconnect error");
            disconnectData.setIsExpected(false);
        }

        broadcastToRoom(roomId,"disconnect",disconnectData,responseTimestamp);
    }
}