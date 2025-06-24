package cn.edu.xmu.whiteboard.dao.bo;

import cn.edu.xmu.whiteboard.dao.ProjectDao;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true, doNotUseGetters = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Project {
    private int id;
    private String name;
    private String description;
    private int userId;

    @Setter
    @JsonIgnore
    @ToString.Exclude
    private ProjectDao projectDao;

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}

    public int getUserId() {return userId;}
    public void setUserId(int userId) {this.userId = userId;}
}
