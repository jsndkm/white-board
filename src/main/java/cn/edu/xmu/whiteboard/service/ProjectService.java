package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.ReturnData.ProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectUserData;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.controller.dto.ProjectUserDto;
import cn.edu.xmu.whiteboard.dao.ProjectDao;
import cn.edu.xmu.whiteboard.dao.UserDao;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private UserDao userDao;

    public ProjectReturnData newProject(String username, ProjectDto projectDto){
        if(projectDto == null){
            throw new IllegalArgumentException("projectDTO is null");
        }
        // 检查用户名是否存在
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        ProjectPO project = projectDao.createProject(username,projectDto);
        ProjectReturnData data = new ProjectReturnData(project.getId(),project.getName(),project.getDescription());
        return data;
    }

    public ProjectUserData getProject(String username, Integer id){
        if(id==null){
            throw new IllegalArgumentException("project id is null");
        }
        // 检查用户名是否存在
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        ProjectPO projectPO = projectDao.getProject(id);
        ProjectReturnData data = new ProjectReturnData(projectPO.getId(), projectPO.getName(), projectPO.getDescription());

        List<ProjectUserDto> projectUserDtos = projectDao.getProjectUser(id);
        return new ProjectUserData(data, projectUserDtos);
    }
}
