package cn.edu.xmu.whiteboard.WebSocket.pojo;

import com.alibaba.fastjson2.JSONObject;

public class Message {
    private String name;
    private String message;

    public Message() {

    }

    public Message(String name, String message) {
        this.name = name;
        this.message = message;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String toJsonString() {
        return JSONObject.toJSONString(this); // 使用 FastJSON 自动序列化
    }

}
