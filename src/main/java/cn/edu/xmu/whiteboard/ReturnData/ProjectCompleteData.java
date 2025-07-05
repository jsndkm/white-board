package cn.edu.xmu.whiteboard.ReturnData;

import cn.edu.xmu.whiteboard.controller.dto.ProjectUserDto;

import java.util.List;

public class ProjectCompleteData {
    private int id;
    private String name;
    private String description;
    private List<ProjectUserDto> user;
    private String image;

    public ProjectCompleteData(ProjectReturnData projectReturnData, List<ProjectUserDto> projectUserDtos,String image) {
        this.id = projectReturnData.getId();
        this.name = projectReturnData.getName();
        this.description = projectReturnData.getDescription();
        this.user = projectUserDtos;
        this.image = image;
    }

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}

    public List<ProjectUserDto> getUser() {return user;}
    public void setUser(List<ProjectUserDto> projectUserDtos) {this.user = projectUserDtos;}

    public String getImage() {return image;}
    public void setImage(String image) {this.image = image;}
}
