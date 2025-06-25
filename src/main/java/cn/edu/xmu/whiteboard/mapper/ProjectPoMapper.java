package cn.edu.xmu.whiteboard.mapper;

import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectPoMapper extends JpaRepository<ProjectPO, Long>{
    // 根据username查找Project列表
    List<ProjectPO> findByUsername(String username);
    // 根据id查找project实体
    ProjectPO findById(int id);

}
