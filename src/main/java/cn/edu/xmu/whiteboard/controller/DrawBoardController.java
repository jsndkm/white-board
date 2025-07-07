package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.controller.vo.DrawBoardVO;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.DrawBoardService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
public class DrawBoardController {
    @Autowired
    private DrawBoardService drawBoardService;

    @PostMapping(value = "/scenes", consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<ResultUtil<Object>> storeDrawBoard(
            @RequestHeader("Authorization") String authorization,
            @RequestBody byte[] sceneData) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 存储画板数据
            String sceneId = drawBoardService.storeDrawBoard(sceneData);

            // 返回响应
            DrawBoardVO data=new DrawBoardVO(sceneId);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(data));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @GetMapping(value = "/scenes/{id}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getDrawBoard(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") String id) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 获取画板数据
            byte[] resourceData = drawBoardService.getDrawBoard(id);

            // 设置响应头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            // 返回响应
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resourceData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
