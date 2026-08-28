package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "edges")
public class SemanticEdge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long sourceNodeId;

    @Column(nullable = false)
    private Long targetNodeId;

    @Column(nullable = false)
    private String relationshipType;

    private Double weight = 1.0;

    @ManyToOne
    @JoinColumn(name = "knowledge_graph_id")
    private KnowledgeGraph knowledgeGraph;

    public SemanticEdge() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSourceNodeId() {
        return sourceNodeId;
    }

    public void setSourceNodeId(Long sourceNodeId) {
        this.sourceNodeId = sourceNodeId;
    }

    public Long getTargetNodeId() {
        return targetNodeId;
    }

    public void setTargetNodeId(Long targetNodeId) {
        this.targetNodeId = targetNodeId;
    }

    public String getRelationshipType() {
        return relationshipType;
    }

    public void setRelationshipType(String relationshipType) {
        this.relationshipType = relationshipType;
    }

    public Double getWeight() { return weight; }

    public void setWeight(Double weight) { this.weight = weight; }

    public KnowledgeGraph getKnowledgeGraph() {
        return knowledgeGraph;
    }

    public void setKnowledgeGraph(KnowledgeGraph knowledgeGraph) {
        this.knowledgeGraph = knowledgeGraph;
    }
}
