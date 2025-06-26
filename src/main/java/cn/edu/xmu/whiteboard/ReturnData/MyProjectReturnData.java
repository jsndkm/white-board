package cn.edu.xmu.whiteboard.ReturnData;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MyProjectReturnData {
    private int id;
    private String name;
    private String description;
    private boolean admin;

    public MyProjectReturnData() {
        id=-1;
        name=null;
        description=null;
        admin=false;
    }

    public MyProjectReturnData(int id, String name, String description, boolean is_admin) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.admin = is_admin;
    }

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}
    @JsonProperty("admin")
    public boolean isIs_admin() {return admin;}
    @JsonProperty("admin")
    public void setIs_admin(boolean is_admin) {this.admin = is_admin;}
}
