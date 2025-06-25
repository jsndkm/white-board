package cn.edu.xmu.whiteboard.dao.bo;

import cn.edu.xmu.whiteboard.dao.IdeaDao;
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
public class Idea {
    private int id;
    private String content;
    private String username;
    private int project_id;

    @Setter
    @JsonIgnore
    @ToString.Exclude
    private IdeaDao ideaDao;

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}

    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}

    public int getProject_id() {return project_id;}
    public void setProject_id(int project_id) {this.project_id = project_id;}
}
