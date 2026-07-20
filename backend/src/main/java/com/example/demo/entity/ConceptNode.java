package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "nodes")
public class ConceptNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String label;

    private Double xPosition;

    private Double yPosition;

    @ManyToOne
    @JoinColumn(name = "knowledge_graph_id")
    private KnowledgeGraph knowledgeGraph;

    public ConceptNode() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getXPosition() {
        return xPosition;
    }

    public void setXPosition(Double xPosition) {
        this.xPosition = xPosition;
    }

    public Double getYPosition() {
        return yPosition;
    }

    public void setYPosition(Double yPosition) {
        this.yPosition = yPosition;
    }

    public KnowledgeGraph getKnowledgeGraph() {
        return knowledgeGraph;
    }

    public void setKnowledgeGraph(KnowledgeGraph knowledgeGraph) {
        this.knowledgeGraph = knowledgeGraph;
    }
}
