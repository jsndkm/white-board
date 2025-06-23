package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.controller.dto.UserDto;
import cn.edu.xmu.whiteboard.dao.UserDao;
import cn.edu.xmu.whiteboard.mapper.po.UserPO;
import cn.edu.xmu.whiteboard.redis.UserKey;
import cn.edu.xmu.whiteboard.utils.MD5Util;
import cn.edu.xmu.whiteboard.utils.UUIDUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public static final String COOKIE_NAME_TOKEN = "token";

    @Autowired
    private UserDao userDao;

    /**
     * 注册用户
     * @param userDTO 用户数据传输对象
     */
    public String registerUser(HttpServletResponse response,UserDto userDTO) {
        // 检查用户名是否已存在
        if (userDao.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        // 创建新的用户实体
        UserPO user = new UserPO();
        user.setUsername(userDTO.getUsername());
        // 对密码进行加密
        String salt=MD5Util.generateSalt();//生成随机salt
        String encryptedPassword = MD5Util.inputPassToDBPass(userDTO.getPassword(), salt);//密码加密
        user.setPassword(encryptedPassword);
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setSalt(salt);

        // 保存用户到数据库
        userDao.save(user);

        // 生成 cookie
        String token = UUIDUtil.uuid();
        addCookie(response, token, user);
        return token;
    }

    private void addCookie(HttpServletResponse response, String token, UserPO user) {
        Cookie cookie = new Cookie(COOKIE_NAME_TOKEN, token);
        cookie.setMaxAge(UserKey.token.expireSeconds());
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
