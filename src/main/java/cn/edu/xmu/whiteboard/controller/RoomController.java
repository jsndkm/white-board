package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.ReturnData.DrawBoardReturnData;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import cn.edu.xmu.whiteboard.service.RoomService;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://192.168.137.1:3000")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @GetMapping(value = "/rooms/{id}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getRoom(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") String id){
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            // 获取房间数据
            byte[] resourceData = roomService.getRoom(id);

            // 设置响应头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            // 返回响应
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resourceData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value = "/rooms/{id}", consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<ResultUtil<Object>> modifyRoom(
            @RequestHeader("Authorization") String authorization,
            @PathVariable("id") String id,
            @RequestBody byte[] roomData) {
        try {
            //解析token
            JWTUtil.analyzeToken(authorization);

            String ID = roomService.modifyRoom(roomData, id);

            DrawBoardReturnData data=new DrawBoardReturnData(ID);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(data));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }
}
