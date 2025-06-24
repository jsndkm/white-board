package cn.edu.xmu.whiteboard.dao;

import cn.edu.xmu.whiteboard.controller.dto.UserDto;
import cn.edu.xmu.whiteboard.mapper.UserPoMapper;
import cn.edu.xmu.whiteboard.mapper.po.UserPO;
import cn.edu.xmu.whiteboard.utils.MD5Util;
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

    public UserPO register(UserDto userDTO){
        if (null == userDTO) {
            throw new IllegalArgumentException("userDTO can not be null");
        }
        // 创建新的用户实体
        UserPO user = new UserPO();
        user.setUsername(userDTO.getUsername());
        // 对密码进行加密
        String salt= MD5Util.generateSalt();//生成随机salt
        String encryptedPassword = MD5Util.inputPassToDBPass(userDTO.getPassword(), salt);//密码加密
        user.setPassword(encryptedPassword);
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setSalt(salt);
        this.userPoMapper.save(user);

        return user;
    }
}
