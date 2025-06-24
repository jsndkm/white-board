package cn.edu.xmu.whiteboard.result;

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
        this.code = ReturnNo.OK.getCode();
        this.message = ReturnNo.OK.getMessage();
        this.data = data;
    }

    public ReturnObject(ReturnNo returnNo) {
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