package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.ReturnData.ProjectReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectUserData;
import cn.edu.xmu.whiteboard.controller.dto.ProjectDto;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.ProjectService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

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
            // 验证 Token
            if (!authorization.startsWith("Bearer ")) {
                return ResultUtil.error(CodeMsg.TOKEN_ERROR);
            }

            String token = authorization.substring(7); // 去掉 "Bearer "

            // 验证 Token
            String username = JWTUtil.parseToken(token);
            if (username == null) {
                return ResultUtil.error(CodeMsg.TOKEN_INVALID);
            }
            ProjectReturnData data = projectService.newProject(username, projectDto);
            return ResultUtil.success(data);
        }catch (Exception e){
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @GetMapping("open-project")
    @ResponseBody
    public ResultUtil<Object> openProject(@RequestHeader("Authorization") String authorization, @RequestParam Integer pid){
        try{
            if(pid == null){
                return ResultUtil.error(CodeMsg.PROJECTID_EMPTY);
            }
            // 验证 Token
            if (!authorization.startsWith("Bearer ")) {
                return ResultUtil.error(CodeMsg.TOKEN_ERROR);
            }

            String token = authorization.substring(7); // 去掉 "Bearer "

            // 验证 Token
            String username = JWTUtil.parseToken(token);
            if (username == null) {
                return ResultUtil.error(CodeMsg.TOKEN_INVALID);
            }
            ProjectUserData data = projectService.getProject(username, pid);
            return ResultUtil.success(data);
        }catch (Exception e){
                GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
                return exceptionHandle.exceptionHandle(e);
        }
    }
}
