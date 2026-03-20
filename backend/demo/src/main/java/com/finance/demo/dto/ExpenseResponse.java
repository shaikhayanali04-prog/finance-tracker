package com.finance.demo.dto;

import java.time.LocalDate;

public class ExpenseResponse {

    private Long id;
    private Double amount;
    private String category;
    private String description;
    private LocalDate date;

    // constructor
    public ExpenseResponse(Long id, Double amount, String category, String description, LocalDate date) {
        this.id = id;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.date = date;
    }

    // getters
    public Long getId() { return id; }
    public Double getAmount() { return amount; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public LocalDate getDate() { return date; }
}