package cn.edu.xmu.whiteboard.dao;

import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.mapper.ProjectPoMapper;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import org.springframework.stereotype.Repository;

import java.util.List;

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

    public List<ProjectPO> findMyProject(String username){
        if(username == null){
            throw new IllegalArgumentException("username can not be null");
        }
        return projectPoMapper.findByUsername(username);
    }
}
