package com.finance.demo.controller;

import com.finance.demo.model.Goal;
import com.finance.demo.model.User;
import com.finance.demo.repository.GoalRepository;
import com.finance.demo.repository.UserRepository;
import com.finance.demo.config.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*") // Allows React to connect
public class GoalController {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public GoalController(GoalRepository goalRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    private User getUserFromToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return userRepository.findById(1L)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        }
        try {
            String token = header.substring(7);
            String email = jwtUtil.extractUsername(token);
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }

    @GetMapping
    public List<Goal> getAllGoals(HttpServletRequest request) {
        User user = getUserFromToken(request);
        return goalRepository.findByUserId(user.getId());
    }

    @PostMapping
    public ResponseEntity<?> createGoal(@RequestBody Goal goal, HttpServletRequest request) {
        User user = getUserFromToken(request);
        goal.setUserId(user.getId());
        if (goal.getCurrentAmount() == null) {
            goal.setCurrentAmount(0.0);
        }
        Goal saved = goalRepository.save(goal);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoal(@PathVariable Long id, @RequestBody Goal goalDetails) {
        return goalRepository.findById(id).map(goal -> {
            if (goalDetails.getTitle() != null) goal.setTitle(goalDetails.getTitle());
            if (goalDetails.getTargetAmount() != null) goal.setTargetAmount(goalDetails.getTargetAmount());
            if (goalDetails.getCurrentAmount() != null) goal.setCurrentAmount(goalDetails.getCurrentAmount());
            if (goalDetails.getDeadline() != null) goal.setDeadline(goalDetails.getDeadline());
            Goal updated = goalRepository.save(goal);
            return ResponseEntity.ok().body(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        return goalRepository.findById(id).map(goal -> {
            goalRepository.delete(goal);
            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", true);
            return ResponseEntity.ok().body(response);
        }).orElse(ResponseEntity.notFound().build());
    }
}
