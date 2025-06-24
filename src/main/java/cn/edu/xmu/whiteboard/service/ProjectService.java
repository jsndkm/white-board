package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.ReturnData.ProjectReturnData;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.dao.ProjectDao;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    @Autowired
    private ProjectDao projectDao;

    public ProjectReturnData newProject(HttpServletResponse response, ProjectDto projectDto){
        if(projectDto == null){
            throw new IllegalArgumentException("projectDTO is null");
        }
        ProjectPO project = projectDao.createProject(projectDto);
        ProjectReturnData data = new ProjectReturnData(project.getId(),project.getName(),project.getDescription());
        return data;
    }
}
