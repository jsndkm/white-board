package cn.edu.xmu.whiteboard.mapper.po;

import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;
import jakarta.persistence.*;


@Entity
@Table(name = "project")
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectPO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // 主键字段

    private String name;
    private String description;
    private String username;

    public int getId() {return id;}
    public String getName() {return name;}
    public String getDescription() {return description;}
    public String getUsername() {return username;}

    public void setId(int id) {this.id = id;}
    public void setName(String name) {this.name = name;}
    public void setDescription(String description) {this.description = description;}
    public void setUsername(String username) {this.username = username;}
}
