package cn.edu.xmu.whiteboard.mapper.po;

import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;
import jakarta.persistence.*;

@Entity
@Table(name = "idea")
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class IdeaPO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String content;
    private String username;
    private int project_id;

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}

    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}

    public int getProject_id() {return project_id;}
    public void setProject_id(int project_id) {this.project_id = project_id;}
}
