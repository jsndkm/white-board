package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.ReturnData.MyProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.NewProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectCompleteData;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.controller.dto.ProjectModifyDto;
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
import java.util.ArrayList;
import java.util.List;

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
            // 获取项目根目录下的 `json` 文件夹路径
            String jsonFolderPath = System.getProperty("user.dir") + File.separator + "json";
            File jsonFolder = new File(jsonFolderPath);

            // 检查文件夹是否存在
            if (!jsonFolder.exists() || !jsonFolder.isDirectory()) {
                throw new RuntimeException("JSON 文件夹不存在或不是目录");
            }

            // 获取所有 `.json` 文件
            File[] jsonFiles = jsonFolder.listFiles((dir, name) -> name.endsWith(".json"));

            // 提取文件名列表
            List<String> fileNames = new ArrayList<>();
            if (jsonFiles != null) {
                for (File file : jsonFiles) {
                    String fileName = file.getName();
                    // 去掉 `.json` 后缀
                    String baseName = fileName.replace(".json", "");

                    // 如果文件名不是“空白模板”，则加上“模型”
                    if (!"空白模板".equals(baseName)) {
                        baseName += "模型";
                    }

                    fileNames.add(baseName);
                }
            }
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(fileNames));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }
}
