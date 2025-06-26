package cn.edu.xmu.whiteboard.result;

public class CodeMsg {

    private int code;

    private String msg;

    private CodeMsg(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    // 通用异常
    public static CodeMsg SUCCESS = new CodeMsg(0, "success");
    public static CodeMsg SERVER_ERROR = new CodeMsg(500100, "服务端异常");
    public static CodeMsg BIND_ERROR = new CodeMsg(500101, "参数校验异常:%s");

    // 登录注册模块
    public static CodeMsg SESSION_ERROR = new CodeMsg(500210, "Session不存在或者已经失效");
    public static CodeMsg PASSWORD_EMPTY = new CodeMsg(500211, "密码不能为空");
    public static CodeMsg USERNAME_EMPTY = new CodeMsg(500212, "用户名不能为空");
    public static CodeMsg USERNAME_NOT_EXIST = new CodeMsg(500213, "用户名不存在");
    public static CodeMsg PASSWORD_ERROR = new CodeMsg(500214, "密码错误");
    public static CodeMsg USERNAME_TOO_SHORT = new CodeMsg(500215, "用户名至少为3个字符");
    public static CodeMsg PASSWORD_TOO_SHORT = new CodeMsg(500216, "密码至少为6个字符");
    public static CodeMsg USERNAME_ALREADY_EXIST = new CodeMsg(500217, "用户名已存在");

    //项目模块
    public static CodeMsg PROJECTNAME_EMPTY = new CodeMsg(500310, "项目名称不能为空");
    public static CodeMsg DESCRIPTION_EMPTY = new CodeMsg(500311, "项目说明不能为空");
    public static CodeMsg PROJECT_ID_EMPTY = new CodeMsg(500312, "项目ID不能为空");
    public static CodeMsg PROJECT_NOT_EXIST = new CodeMsg(500313,"项目不存在");
    public static CodeMsg PROJECT_USER_ALREADY_EXIST = new CodeMsg(500314,"不能重复加入");
    public static CodeMsg PROJECT_USER_NOT_EXIST = new CodeMsg(500315,"用户不在项目中");
    public static CodeMsg PROJECT_NOT_ALLOW_TO_EXIT = new CodeMsg(500316,"项目所有者不允许退出项目");
    public static CodeMsg PROJECT_NOT_ALLOW_TO_DELETE = new CodeMsg(500317,"非项目所有者不允许删除项目");
    public static CodeMsg PROJECT_NOT_ALLOW_TO_JOIN = new CodeMsg(500318,"没有邀请权限");

    //想法模块
    public static CodeMsg CONTENT_NOT_EXIST = new CodeMsg(500410,"想法内容不能为空");

    //token
    public static CodeMsg TOKEN_ERROR = new CodeMsg(500500, "token错误");
    public static CodeMsg TOKEN_INVALID = new CodeMsg(500501, "token无效");

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public CodeMsg fillArgs(Object...args) {
        int code = this.code;
        String message = String.format(this.msg, args);
        return new CodeMsg(code, message);
    }
}
