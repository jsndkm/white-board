package cn.edu.xmu.whiteboard.Exception;


import cn.edu.xmu.whiteboard.result.CodeMsg;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import org.springframework.validation.BindException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandle {

    @ExceptionHandler(value = Exception.class)
    public ResultUtil<String> exceptionHandle(HttpServletRequest request, Exception e) {
        if (e instanceof GlobalException) {
            GlobalException ex = (GlobalException) e;
            return ResultUtil.error(ex.getCm());
        } else if (e instanceof BindException) {
            BindException ex = (BindException) e;
            List<ObjectError> errors = ex.getAllErrors();
            ObjectError error = errors.get(0);
            String msg = error.getDefaultMessage();
            return ResultUtil.error(CodeMsg.BIND_ERROR.fillArgs(msg));
        } else {
            e.printStackTrace(); // 打印异常堆栈到控制台
            return ResultUtil.error(CodeMsg.SERVER_ERROR);
        }
    }
}
