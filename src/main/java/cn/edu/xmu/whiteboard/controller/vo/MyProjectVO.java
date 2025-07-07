package cn.edu.xmu.whiteboard.controller.vo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MyProjectVO {
    private int id;
    private String name;
    private String description;
    private boolean admin;
    private String image;

    public MyProjectVO() {
        id=-1;
        name=null;
        description=null;
        admin=false;
        image=null;
    }

    public MyProjectVO(int id, String name, String description, boolean is_admin, String image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.admin = is_admin;
        this.image = image;
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
    @JsonProperty("image")
    public String getImage() {return image;}
    @JsonProperty("image")
    public void setImage(String image) {this.image = image;}
}
