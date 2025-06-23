package cn.edu.xmu.whiteboard.redis;

public interface KeyPrefix {

    int expireSeconds();
    String getPrefix();
}
