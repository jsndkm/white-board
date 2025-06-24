package cn.edu.xmu.whiteboard.utils;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReturnObject<T> {
    private Integer code;
    private String message;
    private T data;

    public ReturnObject() {
    }

    public ReturnObject(T data) {
        this.code = cn.edu.xmu.whiteboard.utils.ReturnNo.OK.getCode();
        this.message = cn.edu.xmu.whiteboard.utils.ReturnNo.OK.getMessage();
        this.data = data;
    }

    public ReturnObject(cn.edu.xmu.whiteboard.utils.ReturnNo returnNo) {
        this.code = returnNo.getCode();
        this.message = returnNo.getMessage();
    }

    // Getters and setters
    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}