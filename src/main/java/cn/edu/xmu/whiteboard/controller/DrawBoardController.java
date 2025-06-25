package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.ReturnData.DrawBoardReturnData;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.DrawBoardService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class DrawBoardController {
    @Autowired
    private DrawBoardService drawBoardService;

    @PostMapping(value = "/scenes", consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResultUtil<Object> storeDrawBoard(
            @RequestHeader("Authorization") String authorization,
            @RequestBody byte[] sceneData) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 存储场景数据
            String sceneId = drawBoardService.storeDrawBoard(sceneData);

            // 返回响应
            DrawBoardReturnData data=new DrawBoardReturnData(sceneId);
            return ResultUtil.success(data);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }
}
