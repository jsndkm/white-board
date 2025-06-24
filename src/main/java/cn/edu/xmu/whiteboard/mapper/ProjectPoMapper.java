package cn.edu.xmu.whiteboard.mapper;

import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectPoMapper extends JpaRepository<ProjectPO, Long>{

}
