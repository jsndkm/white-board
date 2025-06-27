package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.ReturnData.DrawBoardReturnData;
import cn.edu.xmu.whiteboard.ReturnData.ProjectBoardReturnData;
import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardDto;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.ProjectBoardService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectBoardController {
    @Autowired
    private ProjectBoardService projectBoardService;

    @PostMapping("/project-board/{id}")
    public ResultUtil<Object> storeProjectBoard(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") Integer id,
            @RequestBody ProjectBoardDto projectBoardDto) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 存储画板数据
            projectBoardService.storeProjectBoard(projectBoardDto,id);

            // 返回响应
            return ResultUtil.success(null);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @GetMapping("/project-board/{id}")
    public ProjectBoardReturnData getProjectBoard(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") Integer id) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 获取画板数据
            ProjectBoardReturnData resourceData = projectBoardService.getProjectBoard(id);

            return resourceData;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
