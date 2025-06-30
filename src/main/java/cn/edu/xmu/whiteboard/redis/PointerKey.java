package cn.edu.xmu.whiteboard.redis;

public class PointerKey extends BasePrefix{
    private PointerKey(String prefix) {super(prefix);}

    private PointerKey(int expireSeconds, String prefix) {super(expireSeconds, prefix);}

    public static PointerKey getById = new PointerKey(0, "pointer");
    public static PointerKey getByHash = new PointerKey("pointer");
}
