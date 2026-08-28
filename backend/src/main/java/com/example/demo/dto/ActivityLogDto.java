package com.example.demo.dto;

import java.time.LocalDateTime;

public class ActivityLogDto {
    private Long id;
    private Long graphId;
    private Long userId;
    private String username;
    private String action;
    private LocalDateTime timestamp;
    private String details;

    public ActivityLogDto() {}

    public ActivityLogDto(Long id, Long graphId, Long userId, String username, String action, LocalDateTime timestamp, String details) {
        this.id = id; this.graphId = graphId; this.userId = userId; this.username = username;
        this.action = action; this.timestamp = timestamp; this.details = details;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getGraphId() { return graphId; }
    public void setGraphId(Long graphId) { this.graphId = graphId; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
