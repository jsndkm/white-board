package cn.edu.xmu.whiteboard.WebSocket;

import cn.edu.xmu.whiteboard.WebSocket.pojo.WebSocketMessage;
import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardDto;
import cn.edu.xmu.whiteboard.redis.PointerKey;
import cn.edu.xmu.whiteboard.redis.ProjectBoardKey;
import cn.edu.xmu.whiteboard.redis.RedisService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CopyOnWriteArraySet;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import cn.edu.xmu.whiteboard.WebSocket.SpringContextHolder;

@ServerEndpoint(value = "/ws")
@Component
public class WebSocketServer {
    private final static Logger log = LoggerFactory.getLogger(WebSocketServer.class);

    private RedisService getRedisService() {
        return SpringContextHolder.getBean(RedisService.class);
    }

    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static CopyOnWriteArraySet<WebSocketServer> webSocketSet = new CopyOnWriteArraySet<WebSocketServer>();
    // 房间信息：roomId -> RoomInfo
    private static final Map<String, RoomInfo> roomMap = new ConcurrentHashMap<>();
    // 用户会话：username -> WebSocketServer
    private static final Map<String, WebSocketServer> userSessionMap = new ConcurrentHashMap<>();

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;
    // 当前房间ID
    private String currentRoomId;
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
        //从set中删除
        webSocketSet.remove(this);
        log.info("连接关闭！当前在线人数为" + webSocketSet.size());
        log.info("user disconnect");
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("来自客户端的消息:" + message);

        try {
            JSONObject json = JSON.parseObject(message);
            String type = json.getString("type");
            JSONObject data = json.getJSONObject("data");

            switch (type) {
                case "join-room":
                    handleJoinRoom(data);
                    break;
                case "server-broadcast":
                    handleServerBroadcast(data);
                    break;
                case "server-pointer-broadcast":
                    handleServerPointerBroadcast(data);
                    break;
                case "disconnecting":
                    handleDisconnecting(data);
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

    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    // 发送错误消息
    private void sendError(String errorMessage) {
        try {
            sendMessage(errorMessage);
        } catch (IOException e) {
            log.error("发送错误消息失败", e);
        }
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

    // 处理服务器广播
    private void handleServerBroadcast(JSONObject data) {
        WebSocketMessage.ServerBroadcastData request = data.toJavaObject(WebSocketMessage.ServerBroadcastData.class);

        if (request.getRoomId() == null || request.getRoomId().isEmpty()) {
            sendError("房间ID不能为空");
            return;
        }

        // 广播给房间内所有用户
        RoomInfo roomInfo = roomMap.get(request.getRoomId());
        if (roomInfo != null) {
            WebSocketMessage.ClientBroadcastData response = new WebSocketMessage.ClientBroadcastData();
            response.setElements(request.getElements());
            response.setAppState(request.getAppState());
            response.setFile(request.getFile());

            broadcastToRoom(request.getRoomId(), "client-broadcast", response);
        } else {
            sendError("房间不存在");
        }
    }

    // 处理服务器光标广播
    private void handleServerPointerBroadcast(JSONObject data) {
        WebSocketMessage.ServerPointerBroadcastData request = data.toJavaObject(WebSocketMessage.ServerPointerBroadcastData.class);

        if (request.getRoomId() == null || request.getRoomId().isEmpty()) {
            sendError("房间ID不能为空");
            return;
        }

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
        RoomInfo roomInfo = roomMap.get(request.getRoomId());
        if (roomInfo != null) {
            WebSocketMessage.ClientPointerBroadcastData response = new WebSocketMessage.ClientPointerBroadcastData();
            response.setRoomId(request.getRoomId());

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

            broadcastToRoom(request.getRoomId(), "client-pointer-broadcast", response);
        } else {
            sendError("房间不存在");
        }
    }

    // 向指定房间广播消息
    private void broadcastToRoom(String roomId, String type, Object data) {
        RoomInfo roomInfo = roomMap.get(roomId);
        if (roomInfo != null) {
            String message = JSON.toJSONString(new WebSocketMessage() {{
                setType(type);
                setData(data);
            }});

            roomInfo.getUsers().forEach(username -> {
                WebSocketServer client = userSessionMap.get(username);
                if (client != null) {
                    try {
                        client.sendMessage(message);
                    } catch (IOException e) {
                        log.error("发送消息给用户 {} 失败", username, e);
                    }
                }
            });
        }
    }

    private void initRoom(String username, int projectId){
        //生成roomId
        String roomId = "Room" + projectId;
        this.currentRoomId = roomId;
        RoomInfo roomInfo = new RoomInfo(roomId);
        roomInfo.addUser(username);
        roomMap.put(roomId,roomInfo);

        WebSocketMessage.InitRoomData data = new WebSocketMessage.InitRoomData();
        data.setRoomId(roomId);

        broadcastToRoom(roomId,"init-room",data);
    }

    private void handleJoinRoom(JSONObject data){
        WebSocketMessage.JoinRoomData request = data.toJavaObject(WebSocketMessage.JoinRoomData.class);
        String user = request.getUsername();
        if(user == null){
            sendError("用户名不能为空");
            return;
        }
        userSessionMap.put(user,this);
        if(request.getProjectId()>0) {
            if(currentRoomId!=null){
                RoomInfo tmp = roomMap.get(currentRoomId);
                tmp.removeUser(user);
                WebSocketMessage.RoomUserChangeData userChangeData = new WebSocketMessage.RoomUserChangeData();
                userChangeData.setUsername(user);
                userChangeData.setAction("leave");
                broadcastToRoom(currentRoomId,"room-user-change",userChangeData);
                log.info(user+"离开房间:"+currentRoomId);
            }
            RoomInfo room = roomMap.get("Room"+request.getProjectId());
            if(room==null){
                initRoom(user,request.getProjectId());
            }
            else {
                currentRoomId = room.roomId;
                room.addUser(user);
                roomMap.put(room.roomId,room);
            }

            WebSocketMessage.RoomUserChangeData Data = new WebSocketMessage.RoomUserChangeData();
            Data.setUsername(user);
            Data.setAction("join");
            broadcastToRoom(currentRoomId,"room-user-change",Data);
            log.info(user+"加入房间:"+currentRoomId);
        }
        else {
            sendError("项目ID无效");
        }
    }

    private void handleDisconnecting(JSONObject data){
        WebSocketMessage.DisconnectingData request = data.toJavaObject(WebSocketMessage.DisconnectingData.class);
        String user = request.getUsername();
        if(user == null){
            sendError("用户名不能为空");
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
        try {
            RoomInfo room = roomMap.get(currentRoomId);
            room.removeUser(user);
            WebSocketMessage.RoomUserChangeData userChangeData = new WebSocketMessage.RoomUserChangeData();
            userChangeData.setUsername(user);
            userChangeData.setAction("leave");
            broadcastToRoom(currentRoomId,"room-user-change",userChangeData);
            log.info(user+"断开连接");
        } catch (Exception e){
            log.error("quit room error");
            disconnectData.setIsExpected(false);
        }

        broadcastToRoom(currentRoomId,"disconnect",disconnectData);
    }
}