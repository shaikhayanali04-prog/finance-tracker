package com.finance.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.finance.demo.config.JwtUtil;
import com.finance.demo.model.User;
import com.finance.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
     private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping
    public User createUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // LOGIN
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

    // GET USERS
    @GetMapping
    public java.util.List<User> getUsers() {
        return userRepository.findAll();
    }
}