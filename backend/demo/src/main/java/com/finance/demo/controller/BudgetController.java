package com.finance.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.finance.demo.config.JwtUtil;
import com.finance.demo.dto.BudgetRequest;
import com.finance.demo.dto.BudgetResponse;
import com.finance.demo.model.Budget;
import com.finance.demo.model.User;
import com.finance.demo.repository.UserRepository;
import com.finance.demo.service.BudgetService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetService budgetService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public BudgetController(BudgetService budgetService,
                             JwtUtil jwtUtil,
                             UserRepository userRepository,
                             BCryptPasswordEncoder encoder) {
        this.budgetService = budgetService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    private User getUserFromToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return userRepository.findByEmail("demo@trakify.local")
                    .orElseGet(() -> {
                        User user = new User();
                        user.setName("Demo User");
                        user.setEmail("demo@trakify.local");
                        user.setPassword(encoder.encode("password"));
                        return userRepository.save(user);
                    });
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

    @PostMapping
    public BudgetResponse addBudget(@Valid @RequestBody BudgetRequest req, HttpServletRequest request) {
        User user = getUserFromToken(request);
        Budget budget = new Budget();
        budget.setAmount(req.getAmount());
        budget.setCategory(req.getCategory());
        budget.setMonth(req.getMonth());
        budget.setUser(user);
        Budget saved = budgetService.saveBudget(budget);
        return new BudgetResponse(saved.getId(), saved.getAmount(), saved.getCategory(), saved.getMonth());
    }

    @GetMapping
    public List<BudgetResponse> getBudgets(HttpServletRequest request) {
        User user = getUserFromToken(request);
        return budgetService.getUserBudgets(user).stream()
                .map(b -> new BudgetResponse(b.getId(), b.getAmount(), b.getCategory(), b.getMonth()))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public BudgetResponse updateBudget(@PathVariable Long id, @Valid @RequestBody BudgetRequest req, HttpServletRequest request) {
        User user = getUserFromToken(request);
        Budget budget = budgetService.getUserBudgetById(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Budget not found"));
        budget.setAmount(req.getAmount());
        budget.setCategory(req.getCategory());
        budget.setMonth(req.getMonth());
        Budget updated = budgetService.saveBudget(budget);
        return new BudgetResponse(updated.getId(), updated.getAmount(), updated.getCategory(), updated.getMonth());
    }

    @DeleteMapping("/{id}")
    public String deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return "Deleted Successfully";
    }
}
