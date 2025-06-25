package cn.edu.xmu.whiteboard.controller.dto;

public class IdeaDto {
    private String content;
    private int projectId;

    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}

    public int getProjectId() {return projectId;}
    public void setProjectId(int projectId) {this.projectId = projectId;}
}
