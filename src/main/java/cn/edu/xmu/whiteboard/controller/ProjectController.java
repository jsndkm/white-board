package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.ReturnData.MyProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectCompleteData;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.controller.dto.ProjectModifyDto;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.ProjectService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/new-project")
    @ResponseBody
    public ResultUtil<Object> newProject(@RequestHeader("Authorization") String authorization, @RequestBody ProjectDto projectDto){
        try{
            if(!StringUtils.hasText(projectDto.getName())){
                return ResultUtil.error(CodeMsg.PROJECTNAME_EMPTY);
            }
            else if(!StringUtils.hasText(projectDto.getDescription())){
                return ResultUtil.error(CodeMsg.DESCRIPTION_EMPTY);
            }
            //解析token
            String username=JWTUtil.analyzeToken(authorization);
            ProjectReturnData data = projectService.newProject(username, projectDto);
            return ResultUtil.success(data);
        }catch (Exception e){
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @GetMapping("/project-list")
    @ResponseBody
    public ResultUtil<Object> findMyProject(@RequestHeader("Authorization") String authorization) {
        try {
            //解析token
            String username=JWTUtil.analyzeToken(authorization);
            List<MyProjectReturnData> data=projectService.findMyProject(username);
            return ResultUtil.success(data);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @PostMapping("/join-project")
    @ResponseBody
    public ResultUtil<Object> joinProject(@RequestHeader("Authorization") String authorization,@RequestParam("project_id") int projectId) {
        try {
            //解析token
            String username=JWTUtil.analyzeToken(authorization);
            projectService.joinProject(username,projectId);
            return ResultUtil.success(null);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @GetMapping("open-project")
    @ResponseBody
    public ResultUtil<Object> openProject(@RequestHeader("Authorization") String authorization, @Param("project_id") Integer id){
        try {
            //解析token
            String username=JWTUtil.analyzeToken(authorization);
            ProjectCompleteData data=projectService.openProject(username,id);
            return ResultUtil.success(data);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @PutMapping("modify-project")
    @ResponseBody
    public ResultUtil<Object> modifyProject(@RequestHeader("Authorization") String authorization, @RequestBody ProjectModifyDto projectModifyDto){
        try{
            if(projectModifyDto.getId()<=0){
                return ResultUtil.error(CodeMsg.PROJECT_ID_EMPTY);
            }
            else if(!StringUtils.hasText(projectModifyDto.getName())){
                return ResultUtil.error(CodeMsg.PROJECTNAME_EMPTY);
            }
            else if(!StringUtils.hasText(projectModifyDto.getDescription())){
                return ResultUtil.error(CodeMsg.DESCRIPTION_EMPTY);
            }
            // 验证 Token
            String username = JWTUtil.analyzeToken(authorization);
            if (username == null) {
                return ResultUtil.error(CodeMsg.TOKEN_INVALID);
            }
            projectService.modifyProject(username, projectModifyDto);
            return ResultUtil.success(null);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }
}
