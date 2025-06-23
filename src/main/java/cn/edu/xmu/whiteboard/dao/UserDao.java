package cn.edu.xmu.whiteboard.dao;

import cn.edu.xmu.whiteboard.mapper.UserPoMapper;
import cn.edu.xmu.whiteboard.mapper.po.UserPO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserDao {

    private final UserPoMapper userPoMapper;

    @Autowired
    public UserDao(UserPoMapper userPoMapper) {
        this.userPoMapper = userPoMapper;
    }

    public boolean existsByUsername(String username)
    {
        if (null == username) {
            throw new IllegalArgumentException("username can not be null");
        }
        return userPoMapper.existsByUsername(username);
    }

    public void save(UserPO user){
        this.userPoMapper.save(user);
    }
}
