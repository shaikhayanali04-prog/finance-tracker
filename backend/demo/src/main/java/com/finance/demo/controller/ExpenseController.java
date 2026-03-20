package com.finance.demo.controller;

import com.finance.demo.dto.*;
import com.finance.demo.model.*;
import com.finance.demo.repository.UserRepository;
import com.finance.demo.service.ExpenseService;
import com.finance.demo.config.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseService expenseService,
                             JwtUtil jwtUtil,
                             UserRepository userRepository) {
        this.expenseService = expenseService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    private User getUserFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractUsername(token);
        return userRepository.findByEmail(email).orElseThrow();
    }

    // ✅ ADD EXPENSE
    @PostMapping
    public ExpenseResponse addExpense(@Valid @RequestBody ExpenseRequest req,
                                     HttpServletRequest request) {

        User user = getUserFromToken(request);

        Expense expense = new Expense();
        expense.setAmount(req.getAmount());
        expense.setCategory(req.getCategory());
        expense.setDescription(req.getDescription());
        expense.setDate(LocalDate.parse(req.getDate()));
        expense.setUser(user);

        Expense saved = expenseService.saveExpense(expense);

        return new ExpenseResponse(
                saved.getId(),
                saved.getAmount(),
                saved.getCategory(),
                saved.getDescription(),
                saved.getDate()
        );
    }

    // ✅ GET EXPENSES
    @GetMapping
    public List<ExpenseResponse> getExpenses(HttpServletRequest request) {

        User user = getUserFromToken(request);

        return expenseService.getUserExpenses(user)
                .stream()
                .map(e -> new ExpenseResponse(
                        e.getId(),
                        e.getAmount(),
                        e.getCategory(),
                        e.getDescription(),
                        e.getDate()
                ))
                .collect(Collectors.toList());
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return "Deleted Successfully";
    }
}