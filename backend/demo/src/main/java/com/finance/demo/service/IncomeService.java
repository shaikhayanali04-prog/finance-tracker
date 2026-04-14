package com.finance.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.finance.demo.model.Income;
import com.finance.demo.model.User;
import com.finance.demo.repository.IncomeRepository;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    public Income saveIncome(Income income) {
        return incomeRepository.save(income);
    }

    public List<Income> getUserIncome(User user) {
        return incomeRepository.findByUser(user);
    }

    public Optional<Income> getUserIncomeById(Long id, User user) {
        return incomeRepository.findByIdAndUser(id, user);
    }

    public void deleteIncome(Long id) {
        incomeRepository.deleteById(id);
    }
}
