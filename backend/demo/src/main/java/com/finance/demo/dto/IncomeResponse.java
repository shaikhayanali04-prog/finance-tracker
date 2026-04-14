package com.finance.demo.dto;

import java.time.LocalDate;

public class IncomeResponse {

    private Long id;
    private String title;
    private Double amount;
    private String source;
    private LocalDate date;

    public IncomeResponse(Long id, String title, Double amount, String source, LocalDate date) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.source = source;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Double getAmount() {
        return amount;
    }

    public String getSource() {
        return source;
    }

    public LocalDate getDate() {
        return date;
    }
}
