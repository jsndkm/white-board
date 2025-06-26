package cn.edu.xmu.whiteboard.dao;

import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.controller.dto.ProjectModifyDto;
import cn.edu.xmu.whiteboard.mapper.ProjectPoMapper;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectDao {
    private final ProjectPoMapper projectPoMapper;

    public ProjectDao(ProjectPoMapper projectPoMapper) {this.projectPoMapper = projectPoMapper;}

    public ProjectPO createProject(String username,ProjectDto projectDto){
        if(projectDto == null){
            throw new IllegalArgumentException("projectDTO can not be null");
        }

        ProjectPO project = new ProjectPO();
        project.setName(projectDto.getName());
        project.setUsername(username);
        project.setDescription(projectDto.getDescription());
        this.projectPoMapper.save(project);

        return project;
    }

    public ProjectPO findById(int id){
        return projectPoMapper.findById(id);
    }

    public ProjectPO getProject(Integer id){
        ProjectPO projectPO = projectPoMapper.findById(id);
        if(projectPO==null){
            throw new IllegalArgumentException("can't find this project");
        }
        else return projectPO;
    }

    public void modifyProject(ProjectModifyDto projectModifyDto,Integer id){
        ProjectPO projectPO = this.projectPoMapper.findById(id);
        if(projectPO==null){
            throw new IllegalArgumentException("can't find this project");
        }
        else {
            projectPO.setName(projectModifyDto.getName());
            projectPO.setDescription(projectModifyDto.getDescription());
            projectPoMapper.save(projectPO);
        }
    }

    public void deleteProject(Integer id){
        ProjectPO projectPO = this.projectPoMapper.findById(id);
        if(projectPO==null){
            throw new IllegalArgumentException("can't find this project");
        }
        else {
            projectPoMapper.delete(projectPO);
        }
    }
}
