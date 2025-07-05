package cn.edu.xmu.whiteboard.Exception;


import cn.edu.xmu.whiteboard.result.CodeMsg;
import cn.edu.xmu.whiteboard.result.ResultUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;

@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandle {

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ResultUtil<Object>> exceptionHandle(Exception e) {
        if (e instanceof GlobalException) {
            GlobalException ex = (GlobalException) e;
            if(ex.getCm().getCode()==500501)
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(ResultUtil.error(ex.getCm()));
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResultUtil.error(ex.getCm()));
        } else if (e instanceof BindException) {
            BindException ex = (BindException) e;
            List<ObjectError> errors = ex.getAllErrors();
            ObjectError error = errors.get(0);
            String msg = error.getDefaultMessage();
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST) // 400 for bind errors
                    .body(ResultUtil.error(CodeMsg.BIND_ERROR.fillArgs(msg)));
        } else {
            e.printStackTrace(); // 打印异常堆栈到控制台
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR) // 500
                    .body(ResultUtil.error(CodeMsg.SERVER_ERROR));
        }
    }
}
