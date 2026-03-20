package com.finance.demo.dto;

import jakarta.validation.constraints.NotNull;

public class ExpenseRequest {

    @NotNull
    private Double amount;

    @NotNull
    private String category;

    private String description;

    @NotNull
    private String date;

    // getters & setters
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}