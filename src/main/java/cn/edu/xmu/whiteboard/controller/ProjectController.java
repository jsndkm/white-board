package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.ReturnData.ProjectReturnData;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.ProjectService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/my-project-list")
    @ResponseBody
    public ResultUtil<Object> findMyProject(@RequestHeader("Authorization") String authorization) {
        try {
            //解析token
            String username=JWTUtil.analyzeToken(authorization);
            List<ProjectReturnData> data=projectService.findMyProject(username);
            return ResultUtil.success(data);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }
}
