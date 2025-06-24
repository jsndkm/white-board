package cn.edu.xmu.whiteboard.utils;

import org.springframework.http.ResponseEntity;

public class Common {
    public static ResponseEntity<ReturnObject> getRetObject(ReturnObject returnObject) {
        if (returnObject.getCode().equals(ReturnNo.OK.getCode())) {
            return ResponseEntity.ok(returnObject);
        } else {
            return ResponseEntity.status(getHttpStatus(returnObject.getCode()))
                    .body(returnObject);
        }
    }

    private static int getHttpStatus(Integer code) {
        // 根据业务状态码映射到HTTP状态码
        if (code >= 600 && code < 700) {
            return 401; // 认证错误
        } else if (code >= 500) {
            return 500; // 服务器错误
        } else {
            return 200; // 默认成功
        }
    }
}
