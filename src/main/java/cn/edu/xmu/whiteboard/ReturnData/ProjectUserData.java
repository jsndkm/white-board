package cn.edu.xmu.whiteboard.ReturnData;

import cn.edu.xmu.whiteboard.controller.dto.ProjectUserDto;

import java.util.List;

public class ProjectUserData {
    private ProjectReturnData projectReturnData;
    private List<ProjectUserDto> projectUserDtos;

    public ProjectUserData(ProjectReturnData projectReturnData, List<ProjectUserDto> projectUserDtos) {
        this.projectReturnData = projectReturnData;
        this.projectUserDtos = projectUserDtos;
    }

    public ProjectReturnData getProjectReturnData() {return projectReturnData;}
    public void setProjectReturnData(ProjectReturnData projectReturnData) {this.projectReturnData = projectReturnData;}

    public List<ProjectUserDto> getProjectUserDtos() {return projectUserDtos;}
    public void setProjectUserDtos(List<ProjectUserDto> projectUserDtos) {this.projectUserDtos = projectUserDtos;}
}
