package cn.edu.xmu.whiteboard.redis;

public class ImageKey extends BasePrefix{
    private ImageKey(String prefix) {super(prefix);}

    private ImageKey(int expireSeconds, String prefix) {super(expireSeconds, prefix);}

    public static ImageKey getById = new ImageKey(0, "image");
    public static ImageKey getByHash = new ImageKey("image");
}
