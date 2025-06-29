package cn.edu.xmu.whiteboard.WebSocket;

import cn.edu.xmu.whiteboard.WebSocket.pojo.Message;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SocketIOServerHandler {

    private final static Logger log = LoggerFactory.getLogger(SocketIOServerHandler.class);

    @Autowired
    private SocketIOServer server; // 由 Spring 管理

    /**
     * 客户端连接时触发
     */
    @OnConnect
    public void onConnect(com.corundumstudio.socketio.SocketIOClient client) {
        log.info("客户端连接: " + client.getSessionId());
        // 可以广播连接消息
        server.getBroadcastOperations().sendEvent("connect_success", "connect success");
    }

    /**
     * 客户端断开连接时触发
     */
    @OnDisconnect
    public void onDisconnect(com.corundumstudio.socketio.SocketIOClient client) {
        log.info("客户端断开连接: " + client.getSessionId());
    }

    /**
     * 收到客户端消息时触发
     */
    @OnEvent("message")
    public void onMessage(com.corundumstudio.socketio.SocketIOClient client, String message) {
        log.info("收到广播消息: " + message);

        // 解析消息（可选，如果客户端发送的是 JSON）
        Message msg = new Message("unknown", message); // 简单处理，实际可解析 JSON

        // 广播消息给所有客户端
        server.getBroadcastOperations().sendEvent("broadcast_message", msg.toJsonString());
    }

    /**
     * 客户端加入房间时触发
     */
    @OnEvent("joinRoom")
    public void joinRoom(com.corundumstudio.socketio.SocketIOClient client, String room) {
        log.info("加入房间: " + room);

        // 解析消息（可选，如果客户端发送的是 JSON）
        Message msg = new Message("unknown", room);
        client.joinRoom(room);
        // 广播消息给所有客户端
        server.getRoomOperations(room).sendEvent("join_room_message", msg.toJsonString());
    }

    /**
     * 收到客户端消息时触发
     */
    @OnEvent("roomMessage")
    public void onRoomMessage(com.corundumstudio.socketio.SocketIOClient client, String message, String room) {
        log.info("房间：" + room + " 收到消息: " + message);

        // 解析消息（可选，如果客户端发送的是 JSON）
        Message msg = new Message("unknown", message); // 简单处理，实际可解析 JSON
        // 广播消息给房间客户端
        server.getRoomOperations(room).sendEvent("broadcast_message", msg.toJsonString());
    }

    /**
     * 客户端离开房间时触发
     */
    @OnEvent("leaveRoom")
    public void leaveRoom(com.corundumstudio.socketio.SocketIOClient client, String room) {
        log.info("离开房间: " + room);

        // 解析消息（可选，如果客户端发送的是 JSON）
        Message msg = new Message("unknown", room);
        client.leaveRoom(room);
        // 广播消息给所有客户端
        server.getRoomOperations(room).sendEvent("leave_room_message", msg.toJsonString());
    }
}