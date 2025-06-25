package cn.edu.xmu.whiteboard.dao;

import cn.edu.xmu.whiteboard.controller.dto.IdeaDto;
import cn.edu.xmu.whiteboard.mapper.IdeaPoMapper;
import cn.edu.xmu.whiteboard.mapper.po.IdeaPO;
import org.springframework.stereotype.Repository;

@Repository
public class IdeaDao {
    private final IdeaPoMapper ideaPoMapper;

    public IdeaDao(IdeaPoMapper ideaPoMapper) {this.ideaPoMapper = ideaPoMapper;}

    public IdeaPO newIdea(String username, IdeaDto ideaDto){
        if(ideaDto==null){
            throw new IllegalArgumentException("ideaDto can not be null");
        }
        IdeaPO ideaPO = new IdeaPO();
        ideaPO.setContent(ideaDto.getContent());
        ideaPO.setUsername(username);
        ideaPO.setProject_id(ideaDto.getProjectId());
        this.ideaPoMapper.save(ideaPO);
        return ideaPO;
    }
}
