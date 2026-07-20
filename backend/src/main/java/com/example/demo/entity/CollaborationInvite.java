package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "collaboration_invites")
public class CollaborationInvite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "graph_id", nullable = false)
    private KnowledgeGraph knowledgeGraph;

    @ManyToOne
    @JoinColumn(name = "inviter_id", nullable = false)
    private SystemAccount inviter;

    @ManyToOne
    @JoinColumn(name = "invitee_id", nullable = false)
    private SystemAccount invitee;

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, REJECTED

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public CollaborationInvite() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public KnowledgeGraph getKnowledgeGraph() {
        return knowledgeGraph;
    }

    public void setKnowledgeGraph(KnowledgeGraph knowledgeGraph) {
        this.knowledgeGraph = knowledgeGraph;
    }

    public SystemAccount getInviter() {
        return inviter;
    }

    public void setInviter(SystemAccount inviter) {
        this.inviter = inviter;
    }

    public SystemAccount getInvitee() {
        return invitee;
    }

    public void setInvitee(SystemAccount invitee) {
        this.invitee = invitee;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
