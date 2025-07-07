package cn.edu.xmu.whiteboard.controller.vo;

import cn.edu.xmu.whiteboard.controller.dto.ProjectUserDto;

import java.util.List;

public class ProjectCompleteVO {
    private int id;
    private String name;
    private String description;
    private List<ProjectUserDto> user;
    private String image;

    public ProjectCompleteVO(ProjectVO projectVO, List<ProjectUserDto> projectUserDtos, String image) {
        this.id = projectVO.getId();
        this.name = projectVO.getName();
        this.description = projectVO.getDescription();
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
