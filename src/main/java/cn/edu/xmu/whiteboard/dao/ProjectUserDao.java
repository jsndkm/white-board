package cn.edu.xmu.whiteboard.dao;

import cn.edu.xmu.whiteboard.mapper.ProjectUserPoMapper;
import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import cn.edu.xmu.whiteboard.mapper.po.ProjectUserPO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProjectUserDao {
    private final ProjectUserPoMapper projectUserPoMapper;

    public ProjectUserDao(ProjectUserPoMapper projectUserPoMapper) {this.projectUserPoMapper = projectUserPoMapper;}

    public List<ProjectUserPO> findMyProject(String username){
        if(username == null){
            throw new IllegalArgumentException("username can not be null");
        }
        return projectUserPoMapper.findByUsername(username);
    }

    public void createProjectUser(String username,ProjectPO projectPO){
        if(username == null){
            throw new IllegalArgumentException("username can not be null");
        }
        if(projectPO == null){
            throw new IllegalArgumentException("projectPO can not be null");
        }
        ProjectUserPO projectUserPO = new ProjectUserPO();
        projectUserPO.setUsername(username);
        projectUserPO.setProjectId(projectPO.getId());
        projectUserPO.setAdmin(true);
        projectUserPoMapper.save(projectUserPO);
    }

    public void createProjectMember(String username,ProjectPO projectPO){
        if(username == null){
            throw new IllegalArgumentException("username can not be null");
        }
        if(projectPO == null){
            throw new IllegalArgumentException("projectPO can not be null");
        }
        ProjectUserPO projectUserPO = new ProjectUserPO();
        projectUserPO.setUsername(username);
        projectUserPO.setProjectId(projectPO.getId());
        projectUserPO.setAdmin(false);
        projectUserPoMapper.save(projectUserPO);
    }

    public ProjectUserPO findByPidAndUname(int pid,String uname){
        if(uname == null){
            throw new IllegalArgumentException("username can not be null");
        }
        return projectUserPoMapper.findByProjectIdAndUsername(pid,uname);
    }
}
