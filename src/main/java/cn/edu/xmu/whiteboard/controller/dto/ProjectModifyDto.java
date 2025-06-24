package cn.edu.xmu.whiteboard.controller.dto;

public class ProjectModifyDto {
    private int id;
    private String name;
    private String description;

    public int getId() {return id;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public void setId(int id) {this.id = id;}
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}
}
