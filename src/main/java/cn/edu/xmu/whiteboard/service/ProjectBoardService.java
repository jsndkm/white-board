package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.controller.dto.pb.*;
import cn.edu.xmu.whiteboard.controller.vo.ProjectBoardVO;
import cn.edu.xmu.whiteboard.redis.ImageKey;
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
            throw new RuntimeException("Failed to store projectBoard data in MongoDB", e);
        }
    }

    public void modifyProjectBoard(ProjectBoardScreenShotDto projectBoardScreenShotDto,int id) {
        //存项目画板
        ProjectBoardDto projectBoardDto=new ProjectBoardDto();
        projectBoardDto.setElements(projectBoardScreenShotDto.getElements());
        projectBoardDto.setAppState(projectBoardScreenShotDto.getAppState());
        projectBoardDto.setFiles(projectBoardScreenShotDto.getFiles());
        storeProjectBoard(projectBoardDto,id);
        //存项目截图
        String image=projectBoardScreenShotDto.getImage();
        // 存储到 Redis
        boolean result = redisService.set(ImageKey.getById, ""+id, image);
        if (!result) {
            throw new RuntimeException("Failed to store projectBoard image data");
        }
        // 存储到 MongoDB
        try {
            ImageMongo imageMongo=new ImageMongo(id, image);
            mongoTemplate.save(imageMongo, "project_image");
        } catch (Exception e) {
            throw new RuntimeException("Failed to store projectBoard image data in MongoDB", e);
        }
    }

    public ProjectBoardVO getProjectBoard(int id) {
        // 先尝试从Redis获取
        ProjectBoardDto projectBoardDto=redisService.get(ProjectBoardKey.getById, ""+id,ProjectBoardDto.class);
        // 如果Redis中没有，则从MongoDB获取
        if (projectBoardDto == null) {
            Query query = new Query(Criteria.where("id").is(id));
            ProjectBoardMongo projectBoardMongo = mongoTemplate.findOne(query, ProjectBoardMongo.class, "project_board");

            // 如果MongoDB中有，写到Redis
            if (projectBoardMongo != null) {
                projectBoardDto=projectBoardMongo.getProjectBoard();
                redisService.set(ProjectBoardKey.getById, ""+id, projectBoardDto);
            }
            else
                throw new RuntimeException("Failed to find projectBoard");
        }
        return formReturnData(projectBoardDto);
    }

    public void deleteProjectBoard(int id) {
        // 删除 Redis 中的数据
        redisService.delete(ProjectBoardKey.getById, ""+id);
        redisService.delete(ImageKey.getById, ""+id);

        // 删除 MongoDB 中的数据
        try {
            Query query = new Query(Criteria.where("id").is(id));
            mongoTemplate.remove(query, ProjectBoardMongo.class, "project_board");
            mongoTemplate.remove(query, ImageMongo.class, "project_image");
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete projectBoard data from MongoDB", e);
        }
    }

    public ProjectBoardVO formReturnData(ProjectBoardDto projectBoardDto) {
        // 创建 ProjectBoardReturnData 对象
        ProjectBoardVO projectBoardVO = new ProjectBoardVO();

        // 设置 appState 和 files
        projectBoardVO.setAppState(projectBoardDto.getAppState());
        projectBoardVO.setFiles(projectBoardDto.getFiles());

        if(projectBoardDto.getElements()==null)
            return projectBoardVO;
        // 遍历 elements 数组
        for (ElementDto elementDto : projectBoardDto.getElements()) {
            if ("rectangle".equals(elementDto.getType())||"diamond".equals(elementDto.getType())||"ellipse".equals(elementDto.getType())||"embeddable".equals(elementDto.getType())) {
                Rectangle rectangle = new Rectangle(elementDto);
                projectBoardVO.getElements().add(rectangle);
            }else if("arrow".equals(elementDto.getType())) {
                Arrow arrow = new Arrow(elementDto);
                projectBoardVO.getElements().add(arrow);
            }else if("line".equals(elementDto.getType())) {
                Line line = new Line(elementDto);
                projectBoardVO.getElements().add(line);
            }else if("freedraw".equals(elementDto.getType())) {
                FreeDraw freeDraw = new FreeDraw(elementDto);
                projectBoardVO.getElements().add(freeDraw);
            }else if("text".equals(elementDto.getType())) {
                Text text = new Text(elementDto);
                projectBoardVO.getElements().add(text);
            }else if("image".equals(elementDto.getType())) {
                Image image = new Image(elementDto);
                projectBoardVO.getElements().add(image);
            }else if("frame".equals(elementDto.getType())) {
                Frame frame = new Frame(elementDto);
                projectBoardVO.getElements().add(frame);
            }
            else {
                // 直接将 ElementDto 对象添加到 elements 列表中
                projectBoardVO.getElements().add(elementDto);
            }
        }
        return projectBoardVO;
    }
}
