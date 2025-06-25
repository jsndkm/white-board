package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.ReturnData.ProjectReturnData;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.dao.ProjectDao;
import cn.edu.xmu.whiteboard.dao.UserDao;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public List<ProjectReturnData> findMyProject(String username){
        // 检查用户名是否存在
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        List<ProjectPO> projectPOList = projectDao.findMyProject(username);
        List<ProjectReturnData> data = new ArrayList<>();

        // 遍历ProjectPO列表并创建ProjectReturnData对象
        for (ProjectPO projectPO : projectPOList) {
            ProjectReturnData returnData = new ProjectReturnData();
            returnData.setId(projectPO.getId());
            returnData.setName(projectPO.getName());
            returnData.setDescription(projectPO.getDescription());
            data.add(returnData);
        }
        return data;
    }
}
