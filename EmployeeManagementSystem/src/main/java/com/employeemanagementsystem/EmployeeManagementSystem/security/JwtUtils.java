package com.employeemanagementsystem.EmployeeManagementSystem.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {

    // Secret key from application.properties
    @Value("${jwt.secret}")
    private String secret;

    // How long token lasts (in milliseconds) from application.properties
    @Value("${jwt.expiration}")
    private long expiration;

    // Create a token using username and role
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)           // store username in token
                .claim("role", role)            // store role in token
                .setIssuedAt(new Date())        // when token was created
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // when it expires
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
    }

    // Get username from token
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // Get role from token
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // Check if token is valid (not expired, not tampered)
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Helper to read inside the token
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}