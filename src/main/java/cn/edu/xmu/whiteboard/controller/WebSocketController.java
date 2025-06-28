package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.WebSocket.WebSocketServer;
import cn.edu.xmu.whiteboard.WebSocket.pojo.Message;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import com.alibaba.fastjson.JSONArray;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class WebSocketController {

    @PostMapping("/send-message")
    public ResponseEntity<ResultUtil<Object>> sendMessage(@RequestHeader("Authorization") String authorization, @RequestBody String message){
        try {
            //解析token
            String username=JWTUtil.analyzeToken(authorization);

            Message msg = new Message();
            msg.setName(username);
            msg.setMessage(message);
            String json = JSONArray.toJSONString(msg);
            WebSocketServer.sendInfo(json);

            // 返回响应
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(null));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }
}
