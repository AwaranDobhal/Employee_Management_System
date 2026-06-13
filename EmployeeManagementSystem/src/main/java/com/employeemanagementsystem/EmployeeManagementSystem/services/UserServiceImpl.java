package com.employeemanagementsystem.EmployeeManagementSystem.services;

import com.employeemanagementsystem.EmployeeManagementSystem.entity.UserEntity;
import com.employeemanagementsystem.EmployeeManagementSystem.model.User;
import com.employeemanagementsystem.EmployeeManagementSystem.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // ← ADD THIS

    @Override
    public String registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username already exists";
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
        return "Email already exists";
    }

        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(user, userEntity);

        // ← HASH password before saving
        userEntity.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(userEntity);
        return "Registered Successfully";
    }

    @Override
    public User loginUser(String username, String password) {
        Optional<UserEntity> userEntityOpt = userRepository.findByUsername(username);

        if (userEntityOpt.isEmpty()) {
            return null;
        }

        UserEntity userEntity = userEntityOpt.get();

        // ← COMPARE entered password with hashed password in DB
        if (!passwordEncoder.matches(password, userEntity.getPassword())) {
            return null;
        }

        User user = new User();
        BeanUtils.copyProperties(userEntity, user);
        user.setPassword(null);
        return user;
    }
}