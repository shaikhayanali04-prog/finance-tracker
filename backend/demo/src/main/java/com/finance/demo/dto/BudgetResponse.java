package com.finance.demo.dto;

public class BudgetResponse {
    private Long id;
    private Double amount;
    private String category;
    private String month;

    public BudgetResponse() {}

    public BudgetResponse(Long id, Double amount, String category, String month) {
        this.id = id;
        this.amount = amount;
        this.category = category;
        this.month = month;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
}
