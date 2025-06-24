package cn.edu.xmu.whiteboard.dao.bo;

import cn.edu.xmu.whiteboard.dao.UserDao;
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
public class User {
    private int id;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String salt;

    @Setter
    @JsonIgnore
    @ToString.Exclude
    private UserDao userDao;

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}

    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getPhone() {return phone;}
    public void setPhone(String phone) {this.phone = phone;}

    public String getSalt() {return salt;}
    public void setSalt(String salt) {this.salt = salt;}
}
