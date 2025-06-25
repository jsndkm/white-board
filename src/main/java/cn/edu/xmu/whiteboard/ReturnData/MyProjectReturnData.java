package cn.edu.xmu.whiteboard.ReturnData;

public class MyProjectReturnData {
    private int id;
    private String name;
    private String description;
    private boolean is_admin;

    public MyProjectReturnData() {
        id=-1;
        name=null;
        description=null;
        is_admin=false;
    }

    public MyProjectReturnData(int id, String name, String description, boolean is_admin) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.is_admin = is_admin;
    }

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}
    public boolean isIs_admin() {return is_admin;}
    public void setIs_admin(boolean is_admin) {this.is_admin = is_admin;}
}
