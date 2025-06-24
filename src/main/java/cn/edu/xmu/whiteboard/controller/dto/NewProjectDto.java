package cn.edu.xmu.whiteboard.controller.dto;

public class NewProjectDto {
    private String name;
    private String description;
    private String username;

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
    public String getUsername() {return username;}

    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}
    public void setUsername(String username) {this.username = username;}
}
