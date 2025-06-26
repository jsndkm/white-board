package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.redis.RoomKey;
import cn.edu.xmu.whiteboard.redis.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {
    @Autowired
    private RedisService redisService;

    public String modifyRoom(byte[] roomData, String id) {
        // 存储到Redis
        boolean result = redisService.setBinary(RoomKey.getById, id, roomData);
        if (!result) {
            throw new RuntimeException("Failed to store new room data");
        }
        return id;
    }

    public byte[] getRoom(String id) {
        return redisService.getBinary(RoomKey.getById, id);
    }
}