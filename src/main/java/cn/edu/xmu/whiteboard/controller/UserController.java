package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.controller.dto.UserDto;
import cn.edu.xmu.whiteboard.result.*;
import cn.edu.xmu.whiteboard.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController /*Restful的Controller对象*/
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * 注册用户
     * @param userDTO 用户数据传输对象
     * @return 注册结果
     */
    @PostMapping("/register")
    @ResponseBody
    public ResultUtil<String> registerUser(HttpServletResponse response, @RequestBody UserDto userDTO) {
        try {
            // 检查用户名和密码是否为空
            if (!StringUtils.hasText(userDTO.getUsername())) {
                return ResultUtil.error(CodeMsg.USERNAME_EMPTY);
            } else if (!StringUtils.hasText(userDTO.getPassword())) {
                return ResultUtil.error(CodeMsg.PASSWORD_EMPTY);
            }

            // 检查用户名和密码中是否包含空格
            if (StringUtils.containsWhitespace(userDTO.getUsername())) {
                return ResultUtil.error(CodeMsg.BIND_ERROR);
            } else if (StringUtils.containsWhitespace(userDTO.getPassword())) {
                return ResultUtil.error(CodeMsg.BIND_ERROR);
            }

            // 检查用户名和密码的长度
            if (userDTO.getUsername().length() < 3) {
                return ResultUtil.error(CodeMsg.USERNAME_TOO_SHORT);
            } else if (userDTO.getPassword().length() < 6) {
                return ResultUtil.error(CodeMsg.PASSWORD_TOO_SHORT);
            }

            // 调用 UserService 注册用户
            String token = userService.registerUser(response,userDTO);

            return ResultUtil.success(token);
        } catch (Exception e) {
            // 处理异常情况
            e.printStackTrace();
            if(e.getMessage().equals("Username already exists"))
                return ResultUtil.error(CodeMsg.USERNAME_ALREADY_EXIST);
            return ResultUtil.error(CodeMsg.SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public Object login(@RequestBody UserDto UserDto) {
        UserDto userDto = userService.login(UserDto);

        if (userDto != null) {
            // 登录成功
            return Common.getRetObject(new ReturnObject<>(userDto));
        } else {
            // 登录失败
            return Common.getRetObject(new ReturnObject<>(ReturnNo.AUTH_INVALID_ACCOUNT));
        }
    }
}
