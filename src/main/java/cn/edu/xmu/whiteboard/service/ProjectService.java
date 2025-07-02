package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.ReturnData.MyProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectCompleteData;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.controller.dto.ProjectModifyDto;
import cn.edu.xmu.whiteboard.controller.dto.ProjectUserDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardDto;
import cn.edu.xmu.whiteboard.dao.ProjectDao;
import cn.edu.xmu.whiteboard.dao.ProjectUserDao;
import cn.edu.xmu.whiteboard.dao.UserDao;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import cn.edu.xmu.whiteboard.mapper.po.ProjectUserPO;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.io.File;
import java.nio.file.Paths;
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

    @Autowired
    private ProjectBoardService projectBoardService;

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

        // 根据template属性选择对应的JSON文件
        ProjectBoardDto projectBoardDto = createProjectBoardDtoFromTemplate(projectDto.getTemplate());
        projectBoardService.storeProjectBoard(projectBoardDto,project.getId());
        return data;
    }

    private ProjectBoardDto createProjectBoardDtoFromTemplate(String templateName) {
        // 映射模板名称到JSON文件名
        String jsonFileName;
        switch (templateName) {
            case "空白模板":
                jsonFileName = "空白模板.json";
                break;
            case "STP模型":
                jsonFileName = "STP.json";
                break;
            case "SWOT模型":
                jsonFileName = "SWOT.json";
                break;
            case "SMART模型":
                jsonFileName = "SMART.json";
                break;
            case "Potter模型":
                jsonFileName = "Potter.json";
                break;
            case "PEST模型":
                jsonFileName = "PEST.json";
                break;
            case "BCG模型":
                jsonFileName = "BCG.json";
                break;
            case "merits-drawbacks模型":
                jsonFileName = "merits-drawbacks.json";
                break;
            case "Ansoff模型":
                jsonFileName = "Ansoff.json";
                break;
            // 添加其他模板 case
            default:
                throw new IllegalArgumentException("Unknown template: " + templateName);
        }

        // 使用Jackson反序列化JSON文件
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // JSON文件在项目的根目录下的json文件夹中
            String filePath = Paths.get("json", jsonFileName).toString();
            return objectMapper.readValue(new File(filePath), ProjectBoardDto.class);
        }catch (Exception e) {
            throw new RuntimeException("Failed to load template: " + jsonFileName, e);
        }
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

    public void joinProject(String username, int projectId,String admin){
        if(username==null||admin==null) {
            throw new IllegalArgumentException("username is null");
        }
        if (!userDao.existsByUsername(username)||!userDao.existsByUsername(admin)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        ProjectPO projectPO = projectDao.findById(projectId);
        if(projectPO==null){
            throw new GlobalException(CodeMsg.PROJECT_NOT_EXIST);
        } else if (!projectPO.getUsername().equals(admin)) {
            throw new GlobalException(CodeMsg.PROJECT_NOT_ALLOW_TO_JOIN);
        }
        // 检查项目成员人数是否已满（==5）
        List<ProjectUserPO> members = projectUserDao.findByPid(projectId);
        if (members != null && members.size() == 5) {
            throw new GlobalException(CodeMsg.PROJECT_MEMBER_FULL);
        }
        ProjectUserPO projectUserPO=projectUserDao.findByPidAndUname(projectId,username);
        if(projectUserPO!=null||projectPO.getUsername().equals(username)){
            throw new GlobalException(CodeMsg.PROJECT_USER_ALREADY_EXIST);
        }
        projectUserDao.createProjectMember(username,projectPO);
    }

    public boolean kickProject(String username, int projectId,String admin){
        if(username==null||admin==null) {
            throw new IllegalArgumentException("username is null");
        }
        if (!userDao.existsByUsername(username)||!userDao.existsByUsername(admin)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        ProjectPO projectPO = projectDao.findById(projectId);
        if(projectPO==null){
            throw new GlobalException(CodeMsg.PROJECT_NOT_EXIST);
        } else if (!projectPO.getUsername().equals(admin)) {
            throw new GlobalException(CodeMsg.PROJECT_NOT_ALLOW_TO_KICK);
        }
        ProjectUserPO projectUserPO=projectUserDao.findByPidAndUname(projectId,username);
        if(projectUserPO==null){
            throw new GlobalException(CodeMsg.PROJECT_USER_NOT_EXIST);
        }
        Long record=projectUserDao.exitProjectMember(projectId,username);
        if(record==1)
            return true;
        else
            return false;
    }

    public boolean exitProject(String username, int projectId){
        if(username==null) {
            throw new IllegalArgumentException("username is null");
        }
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        ProjectPO projectPO = projectDao.findById(projectId);
        if(projectPO==null){
            throw new GlobalException(CodeMsg.PROJECT_NOT_EXIST);
        }
        if(projectPO.getUsername().equals(username)) {
            throw new GlobalException(CodeMsg.PROJECT_NOT_ALLOW_TO_EXIT);
        }
        ProjectUserPO projectUserPO=projectUserDao.findByPidAndUname(projectId,username);
        if(projectUserPO==null){
            throw new GlobalException(CodeMsg.PROJECT_USER_NOT_EXIST);
        }
        Long record=projectUserDao.exitProjectMember(projectId,username);
        if(record==1)
            return true;
        else
            return false;
    }

    public void modifyProject(String username, ProjectModifyDto projectModifyDto,Integer id) {
        // 检查用户名是否存在
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        //根据username查ProjectUser关联表
        List<ProjectUserPO> projectUserPOList = projectUserDao.findMyProject(username);
        for(int i = 0; i < projectUserPOList.size(); i++){
            ProjectUserPO projectUserPO = projectUserPOList.get(i);
            if(projectUserPO.getProjectId()==id){
                projectDao.modifyProject(projectModifyDto,id);
                return;
            }
        }
        throw new GlobalException(CodeMsg.PROJECT_USER_NOT_EXIST);
    }

    public ProjectCompleteData openProject(String username, Integer id){
        // 检查用户名是否存在
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        //根据username查ProjectUser关联表
        List<ProjectUserPO> projectUserPOList = projectUserDao.findMyProject(username);
        for(int i = 0; i < projectUserPOList.size(); i++){
            ProjectUserPO projectUserPO = projectUserPOList.get(i);
            if(projectUserPO.getProjectId()==id){
                ProjectPO projectPO = projectDao.getProject(id);
                ProjectReturnData projectReturnData = new ProjectReturnData(projectPO.getId(),projectPO.getName(),projectPO.getDescription());
                List<ProjectUserDto> projectUserDtos = projectUserDao.getProjectUser(id);
                return new ProjectCompleteData(projectReturnData, projectUserDtos);
            }
        }
        return null;
    }

    public boolean deleteProject(String username, Integer pid){
        if(username==null) {
            throw new IllegalArgumentException("username is null");
        }
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        ProjectPO projectPO = projectDao.findById(pid);
        if(projectPO==null){
            throw new GlobalException(CodeMsg.PROJECT_NOT_EXIST);
        }
        ProjectUserPO projectUserPO=projectUserDao.findByPidAndUname(pid,username);
        if(projectUserPO==null){
            throw new GlobalException(CodeMsg.PROJECT_USER_NOT_EXIST);
        }
        if(!projectUserPO.isAdmin()){
            throw new GlobalException(CodeMsg.PROJECT_NOT_ALLOW_TO_DELETE);
        }
        Long record=projectUserDao.deleteProjectUser(pid);
        projectDao.deleteProject(pid);
        if(record>0)
            return true;
        else
            return false;
    }
}
