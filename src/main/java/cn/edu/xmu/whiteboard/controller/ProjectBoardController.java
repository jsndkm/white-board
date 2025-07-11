package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.controller.vo.ProjectBoardVO;
import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardDto;
import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardScreenShotDto;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.ProjectBoardService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
public class ProjectBoardController {
    @Autowired
    private ProjectBoardService projectBoardService;

    @PostMapping("/project-board/{id}")
    public ResponseEntity<ResultUtil<Object>> storeProjectBoard(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") Integer id,
            @RequestBody ProjectBoardDto projectBoardDto) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 存储画板数据
            projectBoardService.storeProjectBoard(projectBoardDto,id);

            // 返回响应
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(null));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @PutMapping("/project-board/{id}")
    public ResponseEntity<ResultUtil<Object>> modifyProjectBoard(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") Integer id,
            @RequestBody ProjectBoardScreenShotDto projectBoardScreenShotDto) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 存储画板数据
            projectBoardService.modifyProjectBoard(projectBoardScreenShotDto,id);

            // 返回响应
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(null));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @GetMapping("/project-board/{id}")
    public ResponseEntity<ResultUtil<Object>> getProjectBoard(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") Integer id) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 获取画板数据
            ProjectBoardVO resourceData = projectBoardService.getProjectBoard(id);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(resourceData));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }
}
