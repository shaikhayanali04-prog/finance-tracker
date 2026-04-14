package com.finance.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.finance.demo.model.Expense;
import com.finance.demo.model.User;
import com.finance.demo.repository.ExpenseRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getUserExpenses(User user) {
        return expenseRepository.findByUser(user);
    }

    public Optional<Expense> getUserExpenseById(Long id, User user) {
        return expenseRepository.findByIdAndUser(id, user);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
