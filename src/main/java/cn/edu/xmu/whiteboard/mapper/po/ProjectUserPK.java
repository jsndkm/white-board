package cn.edu.xmu.whiteboard.mapper.po;

import jakarta.persistence.*;
import java.util.Objects;

import java.io.Serializable;

public class ProjectUserPK implements Serializable {

    private int projectId;
    private String username;

    public ProjectUserPK() {

    }

    public ProjectUserPK(int project_id, String username) {
        this.projectId = project_id;
        this.username = username;
    }

    public boolean equals(Object o){

        if(this==o) return true;

        if(o==null || getClass()!=o.getClass()) return false;

        ProjectUserPK that = (ProjectUserPK) o;

        return Objects.equals(projectId,that.projectId)&&Objects.equals(username,that.username);

    }

    @Override

    public int hashCode(){

        return Objects.hash(projectId,username);

    }

    public int getProjectId() { return projectId; }
    public String getUsername() { return username; }

    public void setProjectId(int projectId) { this.projectId = projectId; }
    public void setUsername(String username) { this.username = username; }
}