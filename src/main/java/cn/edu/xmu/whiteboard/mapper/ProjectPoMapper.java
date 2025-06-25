package cn.edu.xmu.whiteboard.mapper;

import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectPoMapper extends JpaRepository<ProjectPO, Long>{
    // 根据username查找Project列表
    List<ProjectPO> findByUsername(String username);
    // 根据id查找project实体
    ProjectPO findById(int id);

    // 根据id修改项目名
    @Modifying
    @Transactional
    @Query("UPDATE ProjectPO p SET p.name = :role WHERE p.id = :id")
    void updateNameById(@Param("id") Integer id, @Param("name") String name);

    // 根据id修改项目描述
    @Modifying
    @Transactional
    @Query("UPDATE ProjectPO p SET p.description = :Description WHERE p.id = :id")
    void updateDescriptionById(@Param("id") Integer id, @Param("description") String Description);
}
