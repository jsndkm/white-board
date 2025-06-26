package cn.edu.xmu.whiteboard.redis;

public class ProjectBoardKey extends BasePrefix{

    private ProjectBoardKey(String prefix) {
        super(prefix);
    }
    private ProjectBoardKey(int expireSeconds,String prefix) {
        super(expireSeconds,prefix);
    }

    public static ProjectBoardKey getById = new ProjectBoardKey(0, "pb");
    public static ProjectBoardKey getByHash = new ProjectBoardKey("pb");
}
