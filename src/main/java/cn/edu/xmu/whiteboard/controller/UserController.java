package cn.edu.xmu.whiteboard.controller;

import cn.edu.xmu.whiteboard.Exception.GlobalException;
import cn.edu.xmu.whiteboard.Exception.GlobalExceptionHandle;
import cn.edu.xmu.whiteboard.controller.dto.LoginDto;
import cn.edu.xmu.whiteboard.controller.vo.LoginVO;
import cn.edu.xmu.whiteboard.controller.dto.UserDto;
import cn.edu.xmu.whiteboard.result.*;
import cn.edu.xmu.whiteboard.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

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
    public ResponseEntity<ResultUtil<Object>> registerUser(HttpServletResponse response, @RequestBody UserDto userDTO) {
        try {
            // 检查用户名和密码是否为空
            if (!StringUtils.hasText(userDTO.getUsername())) {
                throw new GlobalException(CodeMsg.USERNAME_EMPTY);
            } else if (!StringUtils.hasText(userDTO.getPassword())) {
                throw new GlobalException(CodeMsg.PASSWORD_EMPTY);
            }

            // 检查用户名和密码中是否包含空格
            if (StringUtils.containsWhitespace(userDTO.getUsername())||StringUtils.containsWhitespace(userDTO.getPassword())) {
                throw new GlobalException(CodeMsg.BIND_ERROR);
            }

            // 检查用户名和密码的长度
            if (userDTO.getUsername().length() < 6) {
                throw new GlobalException(CodeMsg.USERNAME_TOO_SHORT);
            } else if (userDTO.getPassword().length() < 6) {
                throw new GlobalException(CodeMsg.PASSWORD_TOO_SHORT);
            }

            // 调用 UserService 注册用户
            if(!userService.registerUser(response,userDTO))
                throw  new GlobalException(CodeMsg.SERVER_ERROR);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(null));
        } catch (Exception e) {
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<ResultUtil<Object>> login(HttpServletResponse response, @RequestBody LoginDto loginDTO) {
        try {
            //验证用户名和密码是否为空
            if(!StringUtils.hasText(loginDTO.getUsername())){
                throw new GlobalException(CodeMsg.USERNAME_EMPTY);
            }else if (!StringUtils.hasText(loginDTO.getPassword())) {
                throw new GlobalException(CodeMsg.PASSWORD_EMPTY);
            }

            LoginVO data = userService.login(response,loginDTO);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(data));
        }catch (Exception e){
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ResultUtil<Object>> logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            userService.logout(request, response);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResultUtil.success(null));
        }catch (Exception e){
            GlobalExceptionHandle exceptionHandle = new GlobalExceptionHandle();
            return exceptionHandle.exceptionHandle(e);
        }
    }
}
