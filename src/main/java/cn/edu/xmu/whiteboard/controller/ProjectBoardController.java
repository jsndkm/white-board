package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.ReturnData.DrawBoardReturnData;
import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardDto;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.DrawBoardService;
import cn.edu.xmu.whiteboard.service.ProjectBoardService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectBoardController {
    @Autowired
    private ProjectBoardService projectBoardService;

    @PostMapping("/project-board")
    public ResultUtil<Object> storeProjectBoard(
            @RequestHeader("Authorization") String authorization,
            @RequestParam("project_id") int projectId,
            @RequestParam("id") String id,
            @RequestBody ProjectBoardDto projectBoardDto) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 存储画板数据
            String ID = projectBoardService.storeProjectBoard(projectBoardDto,id);

            // 返回响应
            DrawBoardReturnData data=new DrawBoardReturnData(ID);
            return ResultUtil.success(data);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @GetMapping("/project-board")
    public ProjectBoardDto getDrawBoard(
            @RequestHeader("Authorization") String authorization,
            @RequestParam("project_id") int projectId,
            @RequestParam("id") String id) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 获取画板数据
            ProjectBoardDto resourceData = projectBoardService.getProjectBoard(id);

            return resourceData;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
