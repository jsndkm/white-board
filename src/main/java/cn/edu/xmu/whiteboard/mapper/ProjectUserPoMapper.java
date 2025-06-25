package cn.edu.xmu.whiteboard.mapper;

import cn.edu.xmu.whiteboard.mapper.po.ProjectUserPK;
import cn.edu.xmu.whiteboard.mapper.po.ProjectUserPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectUserPoMapper extends JpaRepository<ProjectUserPO, ProjectUserPK> {
    List<ProjectUserPO> findByProjectId(int id);
    List<ProjectUserPO> findByUsername(String username);
}
