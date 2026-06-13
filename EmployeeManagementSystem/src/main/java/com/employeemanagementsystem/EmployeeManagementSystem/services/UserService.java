package com.employeemanagementsystem.EmployeeManagementSystem.services;

import com.employeemanagementsystem.EmployeeManagementSystem.model.User;

public interface UserService {
    String registerUser(User user);
    User loginUser(String username, String password);
}