package com.finance.demo.service;

import org.springframework.stereotype.Service;
import com.finance.demo.model.Budget;
import com.finance.demo.model.User;
import com.finance.demo.repository.BudgetRepository;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public Budget saveBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public List<Budget> getUserBudgets(User user) {
        return budgetRepository.findByUser(user);
    }

    public Optional<Budget> getUserBudgetById(Long id, User user) {
        return budgetRepository.findByIdAndUser(id, user);
    }

    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}
