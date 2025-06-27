package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.controller.dto.pb.*;
import cn.edu.xmu.whiteboard.ReturnData.ProjectBoardReturnData;
import cn.edu.xmu.whiteboard.redis.DrawBoardKey;
import cn.edu.xmu.whiteboard.redis.ProjectBoardKey;
import cn.edu.xmu.whiteboard.redis.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class ProjectBoardService {
    @Autowired
    private RedisService redisService;

    // 添加MongoTemplate依赖
    @Autowired
    private MongoTemplate mongoTemplate;

    public void storeProjectBoard(ProjectBoardDto projectBoardDto,int id) {
        // 存储到 Redis
        boolean result = redisService.set(ProjectBoardKey.getById, ""+id, projectBoardDto);
        if (!result) {
            throw new RuntimeException("Failed to store projectBoard data");
        }
        // 存储到 MongoDB
        try {
            ProjectBoardMongo projectBoardMongo=new ProjectBoardMongo(id, projectBoardDto);
            mongoTemplate.save(projectBoardMongo, "project_board");
        } catch (Exception e) {
            // 可以选择记录日志或抛出异常
            throw new RuntimeException("Failed to store projectBoard data in MongoDB", e);
        }
    }

    public ProjectBoardReturnData getProjectBoard(int id) {
        // 先尝试从Redis获取
        ProjectBoardDto projectBoardDto=redisService.get(ProjectBoardKey.getById, ""+id,ProjectBoardDto.class);
        // 如果Redis中没有，则从MongoDB获取
        if (projectBoardDto == null) {
            Query query = new Query(Criteria.where("id").is(id));
            ProjectBoardMongo projectBoardMongo = mongoTemplate.findOne(query, ProjectBoardMongo.class, "project_board");

            // 如果MongoDB中有，可以回写到Redis
            if (projectBoardMongo != null) {
                projectBoardDto=projectBoardMongo.getProjectBoard();
                redisService.set(ProjectBoardKey.getById, ""+id, projectBoardDto);
            }
            else
                throw new RuntimeException("Failed to find projectBoard");
        }
        return formReturnData(projectBoardDto);
    }

    public boolean deleteDrawBoard(int id) {
        return redisService.deleteBinary(DrawBoardKey.getById, ""+id);
    }

    public ProjectBoardReturnData formReturnData(ProjectBoardDto projectBoardDto) {
        // 创建 ProjectBoardReturnData 对象
        ProjectBoardReturnData projectBoardReturnData = new ProjectBoardReturnData();

        // 设置 appState 和 files
        projectBoardReturnData.setAppState(projectBoardDto.getAppState());
        projectBoardReturnData.setFiles(projectBoardDto.getFiles());

        // 遍历 elements 数组
        for (ElementDto elementDto : projectBoardDto.getElements()) {
            if ("rectangle".equals(elementDto.getType())||"diamond".equals(elementDto.getType())||"ellipse".equals(elementDto.getType())||"embeddable".equals(elementDto.getType())) {
                Rectangle rectangle = new Rectangle(elementDto);
                projectBoardReturnData.getElements().add(rectangle);
            }else if("arrow".equals(elementDto.getType())) {
                Arrow arrow = new Arrow(elementDto);
                projectBoardReturnData.getElements().add(arrow);
            }else if("line".equals(elementDto.getType())) {
                Line line = new Line(elementDto);
                projectBoardReturnData.getElements().add(line);
            }else if("freedraw".equals(elementDto.getType())) {
                FreeDraw freeDraw = new FreeDraw(elementDto);
                projectBoardReturnData.getElements().add(freeDraw);
            }else if("text".equals(elementDto.getType())) {
                Text text = new Text(elementDto);
                projectBoardReturnData.getElements().add(text);
            }else if("image".equals(elementDto.getType())) {
                Image image = new Image(elementDto);
                projectBoardReturnData.getElements().add(image);
            }else if("frame".equals(elementDto.getType())) {
                Frame frame = new Frame(elementDto);
                projectBoardReturnData.getElements().add(frame);
            }
            else {
                // 直接将 ElementDto 对象添加到 elements 列表中
                projectBoardReturnData.getElements().add(elementDto);
            }
        }
        return projectBoardReturnData;
    }
}
