package cn.edu.xmu.whiteboard.controller.vo;

public class LoginVO {
    private int id;
    private String token;
    private String username;

    public LoginVO(int id, String token, String username) {
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
