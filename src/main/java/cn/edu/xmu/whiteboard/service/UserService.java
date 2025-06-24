package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.controller.dto.LoginDto;
import cn.edu.xmu.whiteboard.controller.dto.LoginReturnData;
import cn.edu.xmu.whiteboard.controller.dto.UserDto;
import cn.edu.xmu.whiteboard.dao.UserDao;
import cn.edu.xmu.whiteboard.dao.bo.User;
import cn.edu.xmu.whiteboard.mapper.po.UserPO;
import cn.edu.xmu.whiteboard.redis.UserKey;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import cn.edu.xmu.whiteboard.utils.MD5Util;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

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
        if(userDTO==null)
        {
            throw new IllegalArgumentException("userDTO is null");
        }
        // 检查用户名是否已存在
        if (userDao.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("username already exists");
        }

        // 注册用户
        UserPO user=userDao.register(userDTO);

        // 生成 cookie
        String token = JWTUtil.generateToken(user.getUsername());
        addCookie(response, token, user);
        return token;
    }

    public LoginReturnData login(HttpServletResponse response, LoginDto loginDTO) {
        if (null == loginDTO) {
            throw new IllegalArgumentException("loginDTO is null");
        }
        String username = loginDTO.getUsername();
        String formPass = loginDTO.getPassword();
        // 验证用户凭证
        UserPO user = userDao.validateUser(username);
        if (null == user) {
            throw new IllegalArgumentException("username is not exists");
        }

        // 验证密码
        String dbPass = user.getPassword();
        String dbSalt = user.getSalt();
        String calculatePass = MD5Util.inputPassToDBPass(formPass, dbSalt);
        if (!calculatePass.equals(dbPass)) {
            throw new IllegalArgumentException("password does not match");
        }
        // 生成 cookie
        String token = JWTUtil.generateToken(user.getUsername());
        addCookie(response, token, user);
        LoginReturnData data=new LoginReturnData(user.getId(),token,user.getUsername());
        return data;
    }

    private void addCookie(HttpServletResponse response, String token, UserPO user) {
        Cookie cookie = new Cookie(COOKIE_NAME_TOKEN, token);
        cookie.setMaxAge(UserKey.token.expireSeconds());
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
