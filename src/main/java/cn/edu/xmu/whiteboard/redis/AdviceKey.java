package cn.edu.xmu.whiteboard.redis;

public class AdviceKey extends BasePrefix{
    private AdviceKey(String prefix) {
        super(prefix);
    }
    private AdviceKey(int expireSeconds,String prefix) {
        super(expireSeconds,prefix);
    }

    public static AdviceKey getById = new AdviceKey(0, "advice");
    public static AdviceKey getByHash = new AdviceKey("advice");
}
