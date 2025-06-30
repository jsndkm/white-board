package cn.edu.xmu.whiteboard.WebSocket.pojo;

import cn.edu.xmu.whiteboard.controller.dto.pb.AppStateDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.ElementDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.FileDto;
import lombok.Data;
import java.util.List;

@Data
public class WebSocketMessage {
    private String type;
    private Object data;
    private long timestamp;

    @Data
    public static class InitRoomData {
        private String roomId;
    }

    @Data
    public static class JoinRoomData {
        private int projectId;
        private String username;
    }

    @Data
    public static class RoomUserChangeData {
        private List<UserInfo> users;
    }

    @Data
    public static class UserInfo {
        private String username;
    }

    @Data
    public static class ServerBroadcastData {
        private String roomId;
        private List<ElementDto> elements;
        private AppStateDto appState;
        private FileDto file;
    }

    @Data
    public static class ServerPointerBroadcastData {
        private String roomId;
        private String username;
        private double x;
        private double y;
    }

    @Data
    public static class ClientBroadcastData {
        private List<ElementDto> elements;
        private AppStateDto appState;
        private FileDto file;
    }

    @Data
    public static class ClientPointerBroadcastData {
        private String roomId;
        private List<PointerInfo> users;
    }

    @Data
    public static class PointerInfo {
        private String username;
        private double x;
        private double y;
    }

    @Data
    public static class DisconnectData {
        private String username;
        private boolean isExpected;
    }
}