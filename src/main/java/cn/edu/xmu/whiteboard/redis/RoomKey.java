package cn.edu.xmu.whiteboard.redis;

public class RoomKey extends BasePrefix {

    private RoomKey(String prefix) {super(prefix);}

    private RoomKey(int expireSeconds, String prefix) {super(expireSeconds, prefix);}

    public static RoomKey getById = new RoomKey(0, "room");
    public static RoomKey getByHash = new RoomKey("room:");
}