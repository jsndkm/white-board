package cn.edu.xmu.whiteboard.result;


public enum ReturnNo {
    // 成功状态码
    OK(0, "成功"),

    // 认证错误
    AUTH_INVALID_ACCOUNT(601, "用户名或密码错误"),
    AUTH_NEED_LOGIN(602, "需要登录"),

    // 其他错误
    INTERNAL_SERVER_ERR(500, "服务器内部错误");

    private int code;
    private String message;

    ReturnNo(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}