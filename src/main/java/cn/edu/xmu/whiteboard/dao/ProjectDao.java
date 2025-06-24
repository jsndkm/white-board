package cn.edu.xmu.whiteboard.dao;

import cn.edu.xmu.whiteboard.controller.dto.NewProjectDto;
import cn.edu.xmu.whiteboard.mapper.ProjectPoMapper;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectDao {
    private final ProjectPoMapper projectPoMapper;

    public ProjectDao(ProjectPoMapper projectPoMapper) {this.projectPoMapper = projectPoMapper;}

    public ProjectPO createProject(NewProjectDto newProjectDto){
        if(newProjectDto == null){
            throw new IllegalArgumentException("projectDTO can not be null");
        }

        ProjectPO project = new ProjectPO();
        project.setName(newProjectDto.getName());
        project.setUsername(newProjectDto.getUsername());
        project.setDescription(newProjectDto.getDescription());
        this.projectPoMapper.save(project);

        return project;
    }
}
