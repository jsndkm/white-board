package cn.edu.xmu.whiteboard.service;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.controller.dto.LoginDto;
import cn.edu.xmu.whiteboard.ReturnData.LoginReturnData;
import cn.edu.xmu.whiteboard.controller.dto.UserDto;
import cn.edu.xmu.whiteboard.dao.UserDao;
import cn.edu.xmu.whiteboard.mapper.po.UserPO;
import cn.edu.xmu.whiteboard.redis.UserKey;
import cn.edu.xmu.whiteboard.result.CodeMsg;
import cn.edu.xmu.whiteboard.utils.JWTUtil;
import cn.edu.xmu.whiteboard.utils.MD5Util;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
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
    public boolean registerUser(HttpServletResponse response,UserDto userDTO) {
        if(userDTO==null)
        {
            throw new IllegalArgumentException("userDTO is null");
        }
        // 检查用户名是否已存在
        if (userDao.existsByUsername(userDTO.getUsername())) {
            throw new GlobalException(CodeMsg.USERNAME_ALREADY_EXIST);
        }

        // 注册用户
        UserPO user=userDao.register(userDTO);

        if(user==null)
            return false;
        return true;
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
            throw new GlobalException(CodeMsg.USERNAME_NOT_EXIST);
        }

        // 验证密码
        String dbPass = user.getPassword();
        String dbSalt = user.getSalt();
        String calculatePass = MD5Util.inputPassToDBPass(formPass, dbSalt);
        if (!calculatePass.equals(dbPass)) {
            throw new GlobalException(CodeMsg.PASSWORD_ERROR);
        }
        // 生成 cookie
        String token = JWTUtil.generateToken(user.getUsername());
        //addCookie(response, token, user);
        LoginReturnData data=new LoginReturnData(user.getId(),token,user.getUsername());
        return data;
    }

    /**
     * 登出用户
     * @param request HttpServletRequest 用于获取请求中的 Cookie
     * @param response HttpServletResponse 用于设置响应中的 Cookie
     */
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // 从请求中获取令牌
        Cookie[] cookies = request.getCookies();
        String token = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (COOKIE_NAME_TOKEN.equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        if (token != null) {
            // 删除客户端的 Cookie
            Cookie cookie = new Cookie(COOKIE_NAME_TOKEN, null);
            cookie.setMaxAge(0); // 立即过期
            cookie.setPath("/");
            response.addCookie(cookie);
        }
    }

    private void addCookie(HttpServletResponse response, String token, UserPO user) {
        Cookie cookie = new Cookie(COOKIE_NAME_TOKEN, token);
        cookie.setMaxAge(UserKey.token.expireSeconds());
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
