package cn.edu.xmu.whiteboard.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JWTUtil {
    private static final String SECRET_KEY = "jsndnkmhzs123456789jsndkmjsndkmjsndkmjsndkm";
    private static final long EXPIRATION_TIME = 86400000; // 24 hours

    public static String generateToken(String username) {
        Map<String, String> claims = new HashMap<>();
        claims.put("username", username);
        return Jwts.builder().setClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 设置过期时间
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // 使用HS256算法和密钥签名
                .compact(); // 生成令牌
    }

    public static String parseToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY) // 设置用于验证签名的密钥
                    .build()
                    .parseClaimsJws(token) // 解析令牌
                    .getBody(); // 获取声明部分

            return claims.get("username", String.class); // 返回用户标识
        } catch (Exception e) {
            e.printStackTrace();
            // 处理异常，比如令牌过期、签名无效等
            return null;
        }
    }

    public static Date getTokenExpiration(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getExpiration(); // 获取过期时间
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
