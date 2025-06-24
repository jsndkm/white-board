package cn.edu.xmu.whiteboard.dao;

import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.controller.dto.ProjectUserDto;
import cn.edu.xmu.whiteboard.mapper.ProjectPoMapper;
import cn.edu.xmu.whiteboard.mapper.ProjectUserPoMapper;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import cn.edu.xmu.whiteboard.mapper.po.ProjectUserPO;
import org.springframework.stereotype.Repository;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Optional;

@Repository
public class ProjectDao {
    private final ProjectPoMapper projectPoMapper;
    private final ProjectUserPoMapper projectUserPoMapper;

    public ProjectDao(ProjectPoMapper projectPoMapper, ProjectUserPoMapper projectUserPoMapper) {
        this.projectPoMapper = projectPoMapper;
        this.projectUserPoMapper = projectUserPoMapper;
    }


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

    public ProjectPO getProject(int id){
        Optional<ProjectPO> projectPO = projectPoMapper.findById(id);

        if(projectPO.isPresent()){
            ProjectPO po = projectPO.get();
            return po;
        }
        return null;
    }

    public List<ProjectUserDto> getProjectUser(int id){
        List<ProjectUserPO> projectUserPOS = projectUserPoMapper.findByProjectId(id);
        if(!projectUserPOS.isEmpty()){
            return projectUserPOS.stream()
                    .map(source -> new ProjectUserDto(source.getUsername(), source.isAdmin()))
                    .collect(Collectors.toList());
        }
        return null;
    }
}
