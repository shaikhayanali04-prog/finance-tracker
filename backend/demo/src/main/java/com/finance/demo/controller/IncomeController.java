package com.finance.demo.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.finance.demo.config.JwtUtil;
import com.finance.demo.dto.IncomeRequest;
import com.finance.demo.dto.IncomeResponse;
import com.finance.demo.model.Income;
import com.finance.demo.model.User;
import com.finance.demo.repository.UserRepository;
import com.finance.demo.service.IncomeService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/income")
@CrossOrigin(origins = "http://localhost:3000")
public class IncomeController {

    private final IncomeService incomeService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public IncomeController(IncomeService incomeService,
                            JwtUtil jwtUtil,
                            UserRepository userRepository,
                            BCryptPasswordEncoder encoder) {
        this.incomeService = incomeService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    private User ensureDemoUser() {
        return userRepository.findByEmail("demo@trakify.local")
                .orElseGet(() -> {
                    User user = new User();
                    user.setName("Demo User");
                    user.setEmail("demo@trakify.local");
                    user.setPassword(encoder.encode("password"));
                    return userRepository.save(user);
                });
    }

    private User getUserFromToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return ensureDemoUser();
        }

        try {
            String token = header.substring(7);
            String email = jwtUtil.extractUsername(token);
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
    }

    @PostMapping
    public IncomeResponse addIncome(@Valid @RequestBody IncomeRequest req,
                                    HttpServletRequest request) {

        User user = getUserFromToken(request);

        Income income = new Income();
        income.setTitle(req.getTitle());
        income.setAmount(req.getAmount());
        income.setSource(req.getSource());
        income.setDate(LocalDate.parse(req.getDate()));
        income.setUser(user);

        Income saved = incomeService.saveIncome(income);

        return new IncomeResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getAmount(),
                saved.getSource(),
                saved.getDate()
        );
    }

    @GetMapping
    public List<IncomeResponse> getIncome(HttpServletRequest request) {

        User user = getUserFromToken(request);

        return incomeService.getUserIncome(user)
                .stream()
                .map(item -> new IncomeResponse(
                        item.getId(),
                        item.getTitle(),
                        item.getAmount(),
                        item.getSource(),
                        item.getDate()
                ))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public IncomeResponse updateIncome(@PathVariable Long id,
                                       @Valid @RequestBody IncomeRequest req,
                                       HttpServletRequest request) {

        User user = getUserFromToken(request);

        Income income = incomeService.getUserIncomeById(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Income not found"));

        income.setTitle(req.getTitle());
        income.setAmount(req.getAmount());
        income.setSource(req.getSource());
        income.setDate(LocalDate.parse(req.getDate()));

        Income updated = incomeService.saveIncome(income);

        return new IncomeResponse(
                updated.getId(),
                updated.getTitle(),
                updated.getAmount(),
                updated.getSource(),
                updated.getDate()
        );
    }

    @DeleteMapping("/{id}")
    public String deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return "Deleted Successfully";
    }
}
