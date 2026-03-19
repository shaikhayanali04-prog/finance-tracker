package com.finance.demo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "mysecretkey123"; // change later

    // ✅ Generate Token
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // ✅ Extract Email from Token
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    // ✅ Extract Expiration
    public Date extractExpiration(String token) {
        return extractClaims(token).getExpiration();
    }

    // ✅ Validate Token
    public boolean validateToken(String token, String email) {
        String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }

    // ✅ Check Expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ✅ Extract All Claims
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}