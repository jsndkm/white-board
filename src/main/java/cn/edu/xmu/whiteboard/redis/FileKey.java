package cn.edu.xmu.whiteboard.redis;

public class FileKey extends BasePrefix{
    private FileKey(String prefix) {super(prefix);}

    private FileKey(int expireSeconds, String prefix) {super(expireSeconds, prefix);}

    public static FileKey getById = new FileKey(0, "file");
    public static FileKey getByHash = new FileKey("file");
}
