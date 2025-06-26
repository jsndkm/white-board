package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.redis.FileKey;
import cn.edu.xmu.whiteboard.redis.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileService {
    @Autowired
    private RedisService redisService;

    public String modifyFile(byte[] fileData, String id) {
        // 存储到Redis
        boolean result = redisService.setBinary(FileKey.getById, id, fileData);
        if (!result) {
            throw new RuntimeException("Failed to store file data");
        }
        return id;
    }

    public byte[] getFile(String id) {
        return redisService.getBinary(FileKey.getById, id);
    }
}
