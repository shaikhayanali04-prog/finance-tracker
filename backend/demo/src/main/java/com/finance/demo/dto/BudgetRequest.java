package com.finance.demo.dto;

import jakarta.validation.constraints.NotNull;

public class BudgetRequest {
    @NotNull
    private Double amount;
    @NotNull
    private String category;
    @NotNull
    private String month;

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
}
