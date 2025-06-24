package cn.edu.xmu.whiteboard.controller.dto;

public class LoginReturnData {
    private int id;
    private String token;
    private String username;

    public LoginReturnData(int id, String token, String username) {
        this.id = id;
        this.token = token;
        this.username = username;
    }

    public int getId() {return id;}
    public String getToken() {return token;}
    public String getUsername() {return username;}

    public void setId(int id) {this.id = id;}
    public void setToken(String token) {this.token = token;}
    public void setUsername(String username) {this.username = username;}
}
