package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.controller.dto.LoginDto;
import cn.edu.xmu.whiteboard.ReturnData.LoginReturnData;
import cn.edu.xmu.whiteboard.ReturnData.RegisterReturnData;
import cn.edu.xmu.whiteboard.controller.dto.UserDto;
import cn.edu.xmu.whiteboard.result.*;
import cn.edu.xmu.whiteboard.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController /*Restful的Controller对象*/
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
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
    public ResultUtil<Object> registerUser(HttpServletResponse response, @RequestBody UserDto userDTO) {
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
            RegisterReturnData data=new RegisterReturnData(token);

            return ResultUtil.success(data);
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @PostMapping("/login")
    @ResponseBody
    public ResultUtil<Object> login(HttpServletResponse response, @RequestBody LoginDto loginDTO) {
        try {
            //验证用户名和密码是否为空
            if(!StringUtils.hasText(loginDTO.getUsername())){
                return ResultUtil.error(CodeMsg.USERNAME_EMPTY);
            }else if (!StringUtils.hasText(loginDTO.getPassword())) {
                return ResultUtil.error(CodeMsg.PASSWORD_EMPTY);
            }

            LoginReturnData data = userService.login(response,loginDTO);
            return ResultUtil.success(data);
        }catch (Exception e){
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @PostMapping("/logout")
    public ResultUtil<Object> logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            userService.logout(request, response);
            return ResultUtil.success(null);
        }catch (Exception e){
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }
}
