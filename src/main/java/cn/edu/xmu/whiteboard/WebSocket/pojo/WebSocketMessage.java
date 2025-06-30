package cn.edu.xmu.whiteboard.WebSocket.pojo;

import cn.edu.xmu.whiteboard.controller.dto.pb.AppStateDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.ElementDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.FileDto;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class WebSocketMessage {
    private String type;
    private Object data;

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
        private List<ElementDto> elements;
    }

    @Data
    public static class ServerVolatileBroadcastData {
        private AppStateDto appState;
        private FileDto file;
    }

    @Data
    public static class ClientBroadcastData {
        private List<ElementDto> elements;
        private AppStateDto appState;
        private FileDto file;
    }

    @Data
    public static class DisconnectData {
        private String username;
        private boolean isExpected;
    }
}
