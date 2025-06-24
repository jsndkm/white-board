package cn.edu.xmu.whiteboard.mapper;

import cn.edu.xmu.whiteboard.mapper.po.ProjectPO;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectPoMapper extends JpaRepository<ProjectPO, Long>{
    Optional<ProjectPO> findById(int id);

    @Modifying
    @Transactional
    @Query("UPDATE ProjectPO p SET p.name = :role WHERE p.id = :id")
    void updateNameById(@Param("id") int id, @Param("name") String name);

    @Modifying
    @Transactional
    @Query("UPDATE ProjectPO p SET p.description = :role WHERE p.id = :id")
    void updateDescriptionById(@Param("id") int id, @Param("description") String description);
}
