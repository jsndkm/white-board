package cn.edu.xmu.whiteboard.controller.dto;

public class ProjectUserDto {

    private String username;
    private boolean isAdmin;

    public ProjectUserDto(String username, boolean isAdmin) {
        this.username = username;
        this.isAdmin = isAdmin;
    }

    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}

    public boolean isAdmin() {return isAdmin;}
    public void setAdmin(boolean admin) {isAdmin = admin;}
}
