package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.ReturnData.IdeaReturnData;
import cn.edu.xmu.whiteboard.controller.dto.IdeaDto;
import cn.edu.xmu.whiteboard.dao.IdeaDao;
import cn.edu.xmu.whiteboard.dao.ProjectDao;
import cn.edu.xmu.whiteboard.dao.UserDao;
import cn.edu.xmu.whiteboard.mapper.po.IdeaPO;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IdeaService {

    @Autowired
    private IdeaDao ideaDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProjectDao projectDao;

    public IdeaReturnData newIdea(String username, IdeaDto ideaDto){
        if(ideaDto == null){
            throw new IllegalArgumentException("ideaDTO is null");
        }
        // 检查用户名是否存在
        if (!userDao.existsByUsername(username)) {
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }
        else if(projectDao.findById(ideaDto.getProjectId())==null){
            throw new GlobalException(CodeMsg.PROJECT_NOT_EXIST);
        }
        IdeaPO ideaPO = ideaDao.newIdea(username,ideaDto);
        IdeaReturnData data =new IdeaReturnData(ideaPO.getId(),ideaPO.getContent());
        return data;
    }
}
