package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "knowledge_graph")
public class KnowledgeGraph {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(length = 100)
    private String domain;

    @Column(nullable = false, columnDefinition = "DOUBLE DEFAULT 0.0")
    private Double complexityScore = 0.0;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isPublic = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private SystemAccount owner;

    @OneToMany(mappedBy = "knowledgeGraph", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConceptNode> nodes = new ArrayList<>();

    @OneToMany(mappedBy = "knowledgeGraph", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SemanticEdge> edges = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public KnowledgeGraph() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public Double getComplexityScore() {
        return complexityScore;
    }

    public void setComplexityScore(Double complexityScore) {
        this.complexityScore = complexityScore;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public SystemAccount getOwner() {
        return owner;
    }

    public void setOwner(SystemAccount owner) {
        this.owner = owner;
    }

    public List<ConceptNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<ConceptNode> nodes) {
        this.nodes = nodes;
    }

    public List<SemanticEdge> getEdges() {
        return edges;
    }

    public void setEdges(List<SemanticEdge> edges) {
        this.edges = edges;
    }
}
