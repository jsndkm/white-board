package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.controller.vo.MyProjectVO;
import cn.edu.xmu.whiteboard.controller.vo.ProjectVO;
import cn.edu.xmu.whiteboard.controller.vo.ProjectCompleteVO;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.controller.dto.ProjectModifyDto;
import cn.edu.xmu.whiteboard.controller.dto.ProjectUserDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.ImageMongo;
import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardDto;
import cn.edu.xmu.whiteboard.dao.ProjectDao;
import cn.edu.xmu.whiteboard.dao.ProjectUserDao;
import cn.edu.xmu.whiteboard.dao.UserDao;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import cn.edu.xmu.whiteboard.mapper.po.ProjectUserPO;
import cn.edu.xmu.whiteboard.redis.ImageKey;
import cn.edu.xmu.whiteboard.redis.RedisService;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

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

    @Autowired
    private RedisService redisService;

    // 添加MongoTemplate依赖
    @Autowired
    private MongoTemplate mongoTemplate;

    public ProjectVO newProject(String username, ProjectDto projectDto){
        if(projectDto == null){
            throw new IllegalArgumentException("projectDTO is null");
        }
        // 检查用户名是否存在
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        ProjectPO project = projectDao.createProject(username,projectDto);
        projectUserDao.createProjectUser(username,project);
        ProjectVO data = new ProjectVO(project.getId(),project.getName(),project.getDescription());

        // 根据template属性选择对应的JSON文件
        ProjectBoardDto projectBoardDto = createProjectBoardDtoFromTemplate(projectDto.getTemplate());
        projectBoardService.storeProjectBoard(projectBoardDto,project.getId());

        // 获取项目根目录
        String rootPath = System.getProperty("user.dir");
        // 处理图片目录
        String imageFolderPath = rootPath + File.separator + "image";
        File imageFolder = new File(imageFolderPath);
        // 存储图片文件映射（key: 模板名称, value: 图片文件）
        Map<String, File> imageFileMap = new HashMap<>();

        if (imageFolder.exists() && imageFolder.isDirectory()) {
            File[] imageFiles = imageFolder.listFiles((dir, name) -> name.endsWith(".png"));

            if (imageFiles != null) {
                for (File imgFile : imageFiles) {
                    String imgName = imgFile.getName().replace(".png", "");
                    // 如果图片名称不是"空白模板"，则加上"模型"后缀（与模板名称匹配）
                    if (!"空白模板".equals(imgName)) {
                        imgName += "模型";
                    }
                    imageFileMap.put(imgName, imgFile);
                }
            }
            // 设置图片（如果存在匹配的图片）
            if (imageFileMap.containsKey(projectDto.getTemplate())) {
                try {
                    File imgFile = imageFileMap.get(projectDto.getTemplate());
                    // 返回图片Base64编码
                    String image = "data:image/png;base64,"+encodeFileToBase64(imgFile);
                    // 存储到 Redis
                    boolean result = redisService.set(ImageKey.getById, ""+project.getId(), image);
                    if (!result) {
                        throw new RuntimeException("Failed to store projectBoard image data");
                    }
                    // 存储到 MongoDB
                    try {
                        ImageMongo imageMongo=new ImageMongo(project.getId(), image);
                        mongoTemplate.save(imageMongo, "project_image");
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to store projectBoard image data in MongoDB", e);
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }
        return data;
    }

    private String encodeFileToBase64(File file) throws IOException {
        byte[] fileContent = Files.readAllBytes(file.toPath());
        return Base64.getEncoder().encodeToString(fileContent);
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

    public List<MyProjectVO> findMyProject(String username){
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

        List<MyProjectVO> data = new ArrayList<>();
        for (int i = 0; i < projectUserPOList.size() && i < projectPOList.size(); i++) {
            ProjectUserPO projectUserPO = projectUserPOList.get(i);
            ProjectPO projectPO = projectPOList.get(i);

            MyProjectVO returnData = new MyProjectVO();
            returnData.setId(projectPO.getId());
            returnData.setName(projectPO.getName());
            returnData.setDescription(projectPO.getDescription());
            returnData.setIs_admin(projectUserPO.isAdmin());

            String image=getImage(projectPO.getId());
            returnData.setImage(image);

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

    public ProjectCompleteVO openProject(String username, Integer id){
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
                ProjectVO projectVO = new ProjectVO(projectPO.getId(),projectPO.getName(),projectPO.getDescription());
                List<ProjectUserDto> projectUserDtos = projectUserDao.getProjectUser(id);
                String image=getImage(id);
                return new ProjectCompleteVO(projectVO, projectUserDtos,image);
            }
        }
        return null;
    }

    public MyProjectVO getProject(String username, Integer id){
        // 检查用户名是否存在
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        ProjectPO projectPO = projectDao.getProject(id);
        if(projectPO==null){
            throw new GlobalException(CodeMsg.PROJECT_NOT_EXIST);
        }
        //根据id和username查ProjectUser关联表
        ProjectUserPO projectUserPO = projectUserDao.findByPidAndUname(id,username);
        if(projectUserPO==null){
            throw new GlobalException(CodeMsg.PROJECT_USER_NOT_EXIST);
        }
        String image=getImage(id);
        return new MyProjectVO(projectPO.getId(), projectPO.getName(),projectPO.getDescription(),projectUserPO.isAdmin(),image);
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
        //删除项目画板
        projectBoardService.deleteProjectBoard(pid);

        Long record=projectUserDao.deleteProjectUser(pid);
        projectDao.deleteProject(pid);
        if(record>0)
            return true;
        else
            return false;
    }

    //获取项目画板截图
    public String getImage(int id){
        // 先尝试从Redis获取
        String image=redisService.get(ImageKey.getById, ""+id,String.class);
        // 如果Redis中没有，则从MongoDB获取
        if (image == null) {
            Query query = new Query(Criteria.where("id").is(id));
            ImageMongo imageMongo = mongoTemplate.findOne(query, ImageMongo.class, "project_image");

            // 如果MongoDB中有，写到Redis
            if (imageMongo != null) {
                image=imageMongo.getImage();
                redisService.set(ImageKey.getById, ""+id, image);
            }
            else
                throw new RuntimeException("Failed to find projectBoard Image");
        }
        return image;
    }
}
