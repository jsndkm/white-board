package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.redis.DrawBoardKey;
import cn.edu.xmu.whiteboard.redis.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class DrawBoardService {
    @Autowired
    private RedisService redisService;
    private static final String ID_PREFIX = "scene_";
    private static final AtomicInteger counter = new AtomicInteger(0);

    public String storeDrawBoard(byte[] sceneData) {
        // 生成唯一ID
        String id = generateUniqueId();

        // 存储到Redis
        boolean result = redisService.setBinary(DrawBoardKey.getById, id, sceneData);
        if (!result) {
            throw new RuntimeException("Failed to store scene data");
        }

        return id;
    }

    private String generateUniqueId() {
        return ID_PREFIX + System.currentTimeMillis() + "_" + counter.incrementAndGet();
    }

    public byte[] getDrawBoard(String id) {
        return redisService.getBinary(DrawBoardKey.getById, id);
    }

    public boolean deleteDrawBoard(String id) {
        return redisService.deleteBinary(DrawBoardKey.getById, id);
    }
}
