package com.example.demo.dto;

import java.time.LocalDateTime;

public class GraphDto {
    private Long id;
    private String title;
    private String description;
    private String domain;
    private Boolean isPublic;
    private Double complexityScore;
    private LocalDateTime createdAt;
    private Long ownerId;

    public GraphDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    
    public Double getComplexityScore() { return complexityScore; }
    public void setComplexityScore(Double complexityScore) { this.complexityScore = complexityScore; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
}
