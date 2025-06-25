package cn.edu.xmu.whiteboard.mapper.po;

import jakarta.persistence.*;
import lombok.ToString;

import java.io.Serializable;

@Entity
@Table(name = "project_user")
@ToString
@IdClass(ProjectUserPK.class)
public class ProjectUserPO implements Serializable {
    @Id
    @Column(name = "project_id")
    private int projectId;

    @Id
    @Column(name = "username")
    private String username;

    @Column(name = "is_admin")
    private boolean isAdmin;


    public int getProjectId() { return projectId; }
    public String getUsername() { return username; }
    public boolean isAdmin() { return isAdmin; }

    public void setProjectId(int projectId) { this.projectId = projectId; }
    public void setUsername(String username) { this.username = username; }
    public void setAdmin(boolean admin) { this.isAdmin = admin; }
}