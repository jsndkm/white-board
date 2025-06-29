package cn.edu.xmu.whiteboard.mapper.po;

import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;
import jakarta.persistence.*;

@Entity
@Table(name = "user")
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserPO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // 主键字段

    private String username;
    private String password;
    private String email;
    private String phone;
    private String salt;

    public int getId() {return this.id;}
    public String getUsername() {return this.username;}
    public String getPassword() {return this.password;}
    public String getEmail() {return this.email;}
    public String getPhone() {return this.phone;}
    public String getSalt() {return this.salt;}

    public void setId(int id) {this.id=id;}
    public void setUsername(String username) {this.username = username;}
    public void setPassword(String password) {this.password = password;}
    public void setEmail(String email) {this.email = email;}
    public void setPhone(String phone) {this.phone = phone;}
    public void setSalt(String salt) {this.salt = salt;}
}
