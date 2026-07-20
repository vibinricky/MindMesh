package com.example.demo.dto;

import java.time.LocalDateTime;

public class ActivityLogDto {
    private Long id;
    private Long graphId;
    private Long userId;
    private String action;
    private LocalDateTime timestamp;
    private String details;

    public ActivityLogDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getGraphId() { return graphId; }
    public void setGraphId(Long graphId) { this.graphId = graphId; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
