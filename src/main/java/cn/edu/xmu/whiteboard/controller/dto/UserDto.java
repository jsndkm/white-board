package cn.edu.xmu.whiteboard.controller.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
public class UserDto {
    private String username;
    private String password;
    private String email;
    private String phone;

    public String getUsername(){return this.username;}
    public String getPassword(){return this.password;}
    public String getEmail(){return this.email;}
    public String getPhone(){return this.phone;}

    public void setUsername(String username){this.username = username;}
    public void setPassword(String password){this.password = password;}
    public void setEmail(String email){this.email = email;}
    public void setPhone(String phone){this.phone = phone;}
}
