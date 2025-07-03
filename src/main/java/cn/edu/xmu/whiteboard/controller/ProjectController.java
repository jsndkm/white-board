package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.ReturnData.MyProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.NewProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectCompleteData;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.controller.dto.ProjectModifyDto;
import cn.edu.xmu.whiteboard.controller.dto.TemplateDto;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.ProjectService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/projects")
    @ResponseBody
    public ResponseEntity<ResultUtil<Object>> newProject(@RequestHeader("Authorization") String authorization, @RequestBody ProjectDto projectDto){
        try{
            if(!StringUtils.hasText(projectDto.getName())){
                throw new GlobalException(CodeMsg.PROJECTNAME_EMPTY);
            }
            else if(!StringUtils.hasText(projectDto.getDescription())){
                throw new GlobalException(CodeMsg.DESCRIPTION_EMPTY);
            }
            //解析token
            String username=JWTUtil.analyzeToken(authorization);
            ProjectReturnData data = projectService.newProject(username, projectDto);
            NewProjectReturnData newProjectReturnData = new NewProjectReturnData(data.getId());
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(newProjectReturnData));
        }catch (Exception e){
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @GetMapping("/project-list")
    @ResponseBody
    public ResponseEntity<ResultUtil<Object>> findMyProject(@RequestHeader("Authorization") String authorization) {
        try {
            //解析token
            String username=JWTUtil.analyzeToken(authorization);
            List<MyProjectReturnData> data=projectService.findMyProject(username);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(data));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @PostMapping("/projects/join")
    @ResponseBody
    public ResponseEntity<ResultUtil<Object>> joinProject(@RequestHeader("Authorization") String authorization,@RequestParam("project_id") int projectId,@RequestParam("username") String username) {
        try {
            //解析token
            String admin=JWTUtil.analyzeToken(authorization);
            projectService.joinProject(username,projectId,admin);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(null));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @Transactional
    @DeleteMapping("/projects/kick")
    @ResponseBody
    public ResponseEntity<ResultUtil<Object>> kickProject(@RequestHeader("Authorization") String authorization,@RequestParam("project_id") int projectId,@RequestParam("username") String username) {
        try {
            //解析token
            String admin=JWTUtil.analyzeToken(authorization);
            if(projectService.kickProject(username,projectId,admin))
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(ResultUtil.success(null));
            else
                throw new GlobalException(CodeMsg.SERVER_ERROR);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @Transactional
    @PostMapping("/projects/exit")
    @ResponseBody
    public ResponseEntity<ResultUtil<Object>> exitProject(@RequestHeader("Authorization") String authorization,@RequestParam("project_id") int projectId) {
        try {
            //解析token
            String username=JWTUtil.analyzeToken(authorization);
            if(projectService.exitProject(username,projectId))
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(ResultUtil.success(null));
            else
                throw new GlobalException(CodeMsg.SERVER_ERROR);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @GetMapping("/projects/{id}")
    @ResponseBody
    public ResponseEntity<ResultUtil<Object>> openProject(@RequestHeader("Authorization") String authorization, @PathVariable("id") Integer id){
        try {
            //解析token
            String username=JWTUtil.analyzeToken(authorization);
            ProjectCompleteData data=projectService.openProject(username,id);
            if(data==null) throw new GlobalException(CodeMsg.PROJECT_NOT_EXIST);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(data));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @PutMapping("/projects/{id}")
    @ResponseBody
    public ResponseEntity<ResultUtil<Object>> modifyProject(@RequestHeader("Authorization") String authorization, @PathVariable("id") Integer id,@RequestBody ProjectModifyDto projectModifyDto){
        try{
            if(id==null){
                throw new GlobalException(CodeMsg.PROJECT_ID_EMPTY);
            }
            else if(!StringUtils.hasText(projectModifyDto.getName())){
                throw new GlobalException(CodeMsg.PROJECTNAME_EMPTY);
            }
            else if(!StringUtils.hasText(projectModifyDto.getDescription())){
                throw new GlobalException(CodeMsg.DESCRIPTION_EMPTY);
            }
            // 验证 Token
            String username = JWTUtil.analyzeToken(authorization);
            if (username == null||username.isEmpty()) {
                throw new GlobalException(CodeMsg.TOKEN_INVALID);
            }
            projectService.modifyProject(username, projectModifyDto,id);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(null));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @Transactional
    @DeleteMapping("/projects/{id}")
    @ResponseBody
    public ResponseEntity<ResultUtil<Object>> deleteProject(@RequestHeader("Authorization") String authorization,@PathVariable("id") Integer id){
        try {
            //解析token
            String username=JWTUtil.analyzeToken(authorization);
            if(projectService.deleteProject(username,id))
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(ResultUtil.success(null));
            else
                throw new GlobalException(CodeMsg.PROJECT_NOT_EXIST);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @GetMapping("/template-list")
    @ResponseBody
    public ResponseEntity<ResultUtil<Object>> findTemplateList(@RequestHeader("Authorization") String authorization) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);
            // 获取项目根目录
            String rootPath = System.getProperty("user.dir");

            // 处理JSON模板文件
            String jsonFolderPath = rootPath + File.separator + "json";
            File jsonFolder = new File(jsonFolderPath);

            if (!jsonFolder.exists() || !jsonFolder.isDirectory()) {
                throw new RuntimeException("JSON 文件夹不存在或不是目录");
            }

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
            }

            // 获取所有JSON文件
            File[] jsonFiles = jsonFolder.listFiles((dir, name) -> name.endsWith(".json"));

            // 构建TemplateDto列表
            List<TemplateDto> templateList = new ArrayList<>();
            if (jsonFiles != null) {
                for (File file : jsonFiles) {
                    String fileName = file.getName();
                    String baseName = fileName.replace(".json", "");

                    if (!"空白模板".equals(baseName)) {
                        baseName += "模型";
                    }

                    TemplateDto templateDto = new TemplateDto();
                    templateDto.setInformation(baseName);

                    // 设置图片（如果存在匹配的图片）
                    if (imageFileMap.containsKey(baseName)) {
                        File imgFile = imageFileMap.get(baseName);
                        // 返回图片Base64编码
                        String imageBase64 = encodeFileToBase64(imgFile);
                        templateDto.setImage(imageBase64);
                    }

                    templateList.add(templateDto);
                }
            }

            // 排序：让 "空白模板" 排在第一位，其余保持原顺序
            templateList.sort((t1, t2) -> {
                if ("空白模板".equals(t1.getName())) {
                    return -1;  // t1 是 "空白模板"，排在前面
                } else if ("空白模板".equals(t2.getName())) {
                    return 1;   // t2 是 "空白模板"，排在后面
                } else {
                    return 0;   // 其他情况保持原顺序
                }
            });

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(templateList));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    private String encodeFileToBase64(File file) throws IOException {
        byte[] fileContent = Files.readAllBytes(file.toPath());
        return Base64.getEncoder().encodeToString(fileContent);
    }
}
