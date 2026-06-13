package com.employeemanagementsystem.EmployeeManagementSystem.controller;

import com.employeemanagementsystem.EmployeeManagementSystem.model.User;
import com.employeemanagementsystem.EmployeeManagementSystem.security.JwtUtils;
import com.employeemanagementsystem.EmployeeManagementSystem.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        // Set default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("User");
        }

        String result = userService.registerUser(user);

        if (result.equals("Username already exists")  || result.equals("Email already exists")) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", result));
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", result));
    }

    // Login and return JWT token
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        // Check username and password
        User loggedInUser = userService.loginUser(user.getUsername(), user.getPassword());

        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }

        // Create a token for the user
        String token = jwtUtils.generateToken(
                loggedInUser.getUsername(),
                loggedInUser.getRole()
        );

        // Send token + user info back to React
        // This matches what your React Login.jsx expects
        return ResponseEntity.ok(Map.of(
                "token",    token,
                "username", loggedInUser.getUsername(),
                "role",     loggedInUser.getRole(),
                "email", loggedInUser.getEmail()
        ));
    }
}