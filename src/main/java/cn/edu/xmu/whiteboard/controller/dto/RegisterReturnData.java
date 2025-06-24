package cn.edu.xmu.whiteboard.controller.dto;

public class RegisterReturnData {
    private String token;

    public RegisterReturnData(String token) {this.token=token;}

    public String getToken() {return this.token;}
    public void setToken(String token) {this.token = token;}
}
