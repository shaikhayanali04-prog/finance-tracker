package com.finance.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.demo.config.JwtUtil;
import com.finance.demo.model.User;
import com.finance.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ REGISTER USER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // ✅ LOGIN USER
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        Optional<User> existingUserOpt = userRepository.findByEmail(user.getEmail());

        if (existingUserOpt.isEmpty()) {
            return "User not found ❌";
        }

        User existingUser = existingUserOpt.get();

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return "Invalid password ❌";
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return "Login successful ✅ Token: " + token;
    }

    // ✅ GET ALL USERS
    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    // ✅ TEST PROTECTED ROUTE
    @GetMapping("/secure")
    public String secure() {
        return "You are authenticated ✅";
    }

    // ✅ TEST PUBLIC ROUTE
    @GetMapping("/test")
    public String test() {
        return "API Working ✅";
    }
}