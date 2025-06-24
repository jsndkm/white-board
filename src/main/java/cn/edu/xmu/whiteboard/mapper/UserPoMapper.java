package cn.edu.xmu.whiteboard.mapper;

import cn.edu.xmu.whiteboard.mapper.po.UserPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPoMapper extends JpaRepository<UserPO, Long> {

    /**
     * 根据用户名查找用户
     * @param username 用户名
     * @return 如果找到用户，返回 true；否则返回 false
     */
    boolean existsByUsername(String username);
    Optional<UserPO> findByUsername(String username);
}
