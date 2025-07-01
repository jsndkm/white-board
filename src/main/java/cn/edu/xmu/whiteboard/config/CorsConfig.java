package cn.edu.xmu.whiteboard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // 限制为 /api 路径
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://192.168.137.1:3000",
                        "http://10.30.41.13:3000",
                        "http://192.168.43.1:3000",
                        "http://192.168.222.1:3000"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true) // 必须为 true
                .maxAge(3600);
    }
}
