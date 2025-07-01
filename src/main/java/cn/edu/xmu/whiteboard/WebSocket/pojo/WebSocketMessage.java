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

    public void setType(String type) {
        this.type = type;
    }
    public void setData(Object data) {
        this.data = data;
    }
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
    public String getType() {
        return type;
    }
    public Object getData() {
        return data;
    }
    public long getTimestamp() {
        return timestamp;
    }

    @Data
    public static class InitRoomData {
        private String roomId;

        public void setRoomId(String roomId) {
            this.roomId = roomId;
        }
        public String getRoomId() {
            return roomId;
        }
    }

    @Data
    public static class JoinRoomData {
        private int projectId;
        private String username;

        public void setProjectId(int projectId) {
            this.projectId = projectId;
        }
        public void setUsername(String username) {
            this.username = username;
        }
        public String getUsername() {
            return username;
        }
        public int getProjectId() {
            return projectId;
        }
    }

    @Data
    public static class RoomUserChangeData {
        private String username;
        private String action;

        public void setUsername(String username) {
            this.username = username;
        }
        public String getUsername() {
            return username;
        }
        public void setAction(String action) {
            this.action = action;
        }
        public String getAction() {
            return action;
        }
    }

    @Data
    public static class UserInfo {
        private String username;

        public void setUsername(String username) {
            this.username = username;
        }
        public String getUsername() {
            return username;
        }
    }

    @Data
    public static class ServerBroadcastData {
        private String roomId;
        private List<ElementDto> elements;
        private AppStateDto appState;
        private FileDto file;

        public void setRoomId(String roomId) {
            this.roomId = roomId;
        }
        public void setElements(List<ElementDto> elements) {
            this.elements = elements;
        }
        public void setAppState(AppStateDto appState) {
            this.appState = appState;
        }
        public void setFile(FileDto file) {
            this.file = file;
        }
        public String getRoomId() {
            return roomId;
        }
        public List<ElementDto> getElements() {
            return elements;
        }
        public AppStateDto getAppState() {
            return appState;
        }
        public FileDto getFile() {
            return file;
        }
    }

    @Data
    public static class ServerPointerBroadcastData {
        private String roomId;
        private String username;
        private double x;
        private double y;

        public void setRoomId(String roomId) {
            this.roomId = roomId;
        }
        public void setUsername(String username) {
            this.username = username;
        }
        public void setX(double x) {
            this.x = x;
        }
        public void setY(double y) {
            this.y = y;
        }
        public String getRoomId() {
            return roomId;
        }
        public String getUsername() {
            return username;
        }
        public double getX() {
            return x;
        }
        public double getY() {
            return y;
        }
    }

    @Data
    public static class ClientBroadcastData {
        private List<ElementDto> elements;
        private AppStateDto appState;
        private FileDto file;

        public void setElements(List<ElementDto> elements) {
            this.elements = elements;
        }
        public void setAppState(AppStateDto appState) {
            this.appState = appState;
        }
        public void setFile(FileDto file) {
            this.file = file;
        }
        public List<ElementDto> getElements() {
            return elements;
        }
        public AppStateDto getAppState() {
            return appState;
        }
        public FileDto getFile() {
            return file;
        }
    }

    @Data
    public static class ClientPointerBroadcastData {
        private String roomId;
        private List<PointerInfo> users;

        public void setRoomId(String roomId) {
            this.roomId = roomId;
        }
        public void setUsers(List<PointerInfo> users) {
            this.users = users;
        }
        public List<PointerInfo> getUsers() {
            return users;
        }
        public String getRoomId() {
            return roomId;
        }
    }

    @Data
    public static class PointerInfo {
        private String username;
        private double x;
        private double y;

        public void setUsername(String username) {
            this.username = username;
        }
        public void setX(double x) {
            this.x = x;
        }
        public void setY(double y) {
            this.y = y;
        }
        public String getUsername() {
            return username;
        }
        public double getX() {
            return x;
        }
        public double getY() {
            return y;
        }
    }

    @Data
    public static class DisconnectData {
        private String username;
        private boolean isExpected;

        public void setUsername(String username) {
            this.username = username;
        }
        public void setIsExpected(boolean isExpected) {
            this.isExpected = isExpected;
        }
        public boolean isExpected() {
            return isExpected;
        }
        public String getUsername() {
            return username;
        }
    }

    @Data
    public static class DisconnectingData {
        private String username;

        public String getUsername() {return username;}
        public void setUsername(String username) {this.username = username;}
    }
}