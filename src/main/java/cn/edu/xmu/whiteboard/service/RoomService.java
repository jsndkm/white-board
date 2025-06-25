package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.redis.DrawBoardKey;
import cn.edu.xmu.whiteboard.redis.RoomKey;
import cn.edu.xmu.whiteboard.redis.RedisService;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RoomService {
    @Autowired
    private RedisService redisService;
    private static final String ID_PREFIX = "room_";
    private static final AtomicInteger counter = new AtomicInteger(0);

    public Integer modifyRoom(byte[] roomData, Integer id) {

        // 存储到Redis
        boolean result = redisService.setBinary(DrawBoardKey.getById, id.toString(), roomData);
        if (!result) {
            throw new RuntimeException("Failed to store room data");
        }

        return id;
    }

    private String generateUniqueId() {
        return ID_PREFIX + System.currentTimeMillis() + "_" + counter.incrementAndGet();
    }

    public byte[] getRoom(String id) {
        return redisService.getBinary(RoomKey.getById, id);
    }

}