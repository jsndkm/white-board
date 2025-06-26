package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.controller.dto.pb.ProjectBoardDto;
import cn.edu.xmu.whiteboard.redis.DrawBoardKey;
import cn.edu.xmu.whiteboard.redis.ProjectBoardKey;
import cn.edu.xmu.whiteboard.redis.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectBoardService {
    @Autowired
    private RedisService redisService;

    public String storeProjectBoard(ProjectBoardDto projectBoardDto,String id) {

        // 存储到Redis
        boolean result = redisService.set(ProjectBoardKey.getById, id, projectBoardDto);
        if (!result) {
            throw new RuntimeException("Failed to store projectBoard data");
        }

        return id;
    }

    public ProjectBoardDto getProjectBoard(String id) {
        return redisService.get(ProjectBoardKey.getById, id,ProjectBoardDto.class);
    }

    public boolean deleteDrawBoard(String id) {
        return redisService.deleteBinary(DrawBoardKey.getById, id);
    }
}
