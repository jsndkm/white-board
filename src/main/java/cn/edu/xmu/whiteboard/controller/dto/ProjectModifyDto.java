package cn.edu.xmu.whiteboard.controller.dto;

public class ProjectModifyDto {
    private int pid;
    private String name;
    private String description;

    public int getPid() {return pid;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public void setPid(int pid) {this.pid = pid;}
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}
}
