package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.controller.dto.UserDto;
import cn.edu.xmu.whiteboard.controller.vo.UserVO;
import cn.edu.xmu.whiteboard.dao.UserDao;
import cn.edu.xmu.whiteboard.dao.bo.User;
import cn.edu.xmu.whiteboard.mapper.po.UserPO;
import cn.edu.xmu.whiteboard.redis.UserKey;
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

        // 注册用户
        UserPO user=userDao.register(userDTO);

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

    public UserDto login(UserDto UserDto) {
        // 验证用户凭证
        User user = userDao.validateUser(UserDto.getUsername(), UserDto.getPassword());

        if (user != null) {
            // 转换为VO对象
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setUsername(user.getUsername());
            // 这里可以添加更多用户信息
            return userDto;
        }
        return null;
    }
}
