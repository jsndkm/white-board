package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.ReturnData.MyProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectReturnData;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.dao.ProjectDao;
import cn.edu.xmu.whiteboard.dao.ProjectUserDao;
import cn.edu.xmu.whiteboard.dao.UserDao;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import cn.edu.xmu.whiteboard.mapper.po.ProjectUserPO;
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

    @Autowired
    private ProjectUserDao projectUserDao;

    public ProjectReturnData newProject(String username, ProjectDto projectDto){
        if(projectDto == null){
            throw new IllegalArgumentException("projectDTO is null");
        }
        // 检查用户名是否存在
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        ProjectPO project = projectDao.createProject(username,projectDto);
        projectUserDao.createProjectUser(username,project);
        ProjectReturnData data = new ProjectReturnData(project.getId(),project.getName(),project.getDescription());
        return data;
    }

    public List<MyProjectReturnData> findMyProject(String username){
        // 检查用户名是否存在
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }

        //根据username查ProjectUser关联表获取projectID
        List<ProjectUserPO> projectUserPOList=projectUserDao.findMyProject(username);

        //根据projectID查project表
        List<ProjectPO> projectPOList = new ArrayList<>();
        for(ProjectUserPO projectUserPO:projectUserPOList){
            ProjectPO projectPO=projectDao.findById(projectUserPO.getProjectId());
            if(projectPO!=null)
                projectPOList.add(projectPO);
        }

        List<MyProjectReturnData> data = new ArrayList<>();
        // 遍历两个列表，假设它们的长度相同
        for (int i = 0; i < projectUserPOList.size() && i < projectPOList.size(); i++) {
            ProjectUserPO projectUserPO = projectUserPOList.get(i);
            ProjectPO projectPO = projectPOList.get(i);

            MyProjectReturnData returnData = new MyProjectReturnData();
            returnData.setId(projectPO.getId());
            returnData.setName(projectPO.getName());
            returnData.setDescription(projectPO.getDescription());
            returnData.setIs_admin(projectUserPO.isAdmin());

            data.add(returnData);
        }
        return data;
    }
}
