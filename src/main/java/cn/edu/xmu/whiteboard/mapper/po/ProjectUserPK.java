package cn.edu.xmu.whiteboard.mapper.po;

import jakarta.persistence.*;
import java.util.Objects;

import java.io.Serializable;

public class ProjectUserPK implements Serializable {

    private int project_id;
    private String username;

    private boolean is_admin;

    public ProjectUserPK() {

    }

    public ProjectUserPK(int project_id, String username, boolean is_admin) {
        this.project_id = project_id;
        this.username = username;
        this.is_admin = is_admin;
    }

    public boolean equals(Object o){

        if(this==o) return true;

        if(o==null || getClass()!=o.getClass()) return false;

        ProjectUserPK that = (ProjectUserPK) o;

        return Objects.equals(project_id,that.project_id)&&Objects.equals(username,that.username);

    }

    @Override

    public int hashCode(){

        return Objects.hash(project_id,username);

    }

    public int getProjectId() { return project_id; }
    public String getUsername() { return username; }
    public boolean isAdmin() { return is_admin; }

    public void setProjectId(int projectId) { this.project_id = projectId; }
    public void setUsername(String username) { this.username = username; }
    public void setAdmin(boolean admin) { this.is_admin = admin; }
}