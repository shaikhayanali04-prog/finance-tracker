package com.finance.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.demo.model.Expense;
import com.finance.demo.model.User;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // 🔥 Get expenses by user
    List<Expense> findByUser(User user);

    Optional<Expense> findByIdAndUser(Long id, User user);
}
