package cn.edu.xmu.whiteboard.redis;


public class DrawBoardKey extends BasePrefix{

    private DrawBoardKey(String prefix) {
        super(prefix);
    }
    private DrawBoardKey(int expireSeconds,String prefix) {
        super(expireSeconds,prefix);
    }

    public static DrawBoardKey getById = new DrawBoardKey(0, "db");
    public static DrawBoardKey getByHash = new DrawBoardKey("db");
}
