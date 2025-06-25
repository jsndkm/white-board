package cn.edu.xmu.whiteboard.mapper;

import cn.edu.xmu.whiteboard.mapper.po.ProjectUserPK;
import cn.edu.xmu.whiteboard.mapper.po.ProjectUserPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectUserPoMapper extends JpaRepository<ProjectUserPO, ProjectUserPK> {
    List<ProjectUserPO> findByProjectId(int id);
    List<ProjectUserPO> findByUsername(String username);

    /**
     * 根据projectId和username查找用户项目
     * @param projectId 项目ID
     * @param username 用户名
     * @return 如果找到记录，返回Optional.of(ProjectUserPO)；否则返回Optional.empty()
     */
    ProjectUserPO findByProjectIdAndUsername(int projectId, String username);
}
