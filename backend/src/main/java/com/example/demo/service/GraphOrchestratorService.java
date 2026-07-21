package com.example.demo.service;

import com.example.demo.dto.GraphDto;
import com.example.demo.entity.KnowledgeGraph;
import java.util.List;
import com.example.demo.entity.SystemAccount;
import com.example.demo.event.ComplexityCalculatedEvent;
import com.example.demo.event.GraphCreatedEvent;
import com.example.demo.event.GraphDeletedEvent;
import com.example.demo.event.GraphUpdatedEvent;
import com.example.demo.repository.KnowledgeGraphRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GraphOrchestratorService {

    @Autowired
    private GraphService graphService;
    
    @Autowired
    private KnowledgeGraphRepository knowledgeGraphRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Transactional
    public KnowledgeGraph createGraphWithEvents(GraphDto graphDto) {
        KnowledgeGraph graph = graphService.createGraph(graphDto);
        eventPublisher.publishEvent(new GraphCreatedEvent(this, graph.getId(), graph.getOwner().getId()));
        return graph;
    }

    @Transactional
    public KnowledgeGraph updateGraphWithEvents(Long id, GraphDto graphDto) {
        KnowledgeGraph graph = graphService.updateGraph(id, graphDto);
        SystemAccount user = graphService.getCurrentUser();
        eventPublisher.publishEvent(new GraphUpdatedEvent(this, graph.getId(), user.getId()));
        return graph;
    }

    @Transactional
    public void deleteGraphWithEvents(Long id) {
        SystemAccount user = graphService.getCurrentUser();
        graphService.deleteGraph(id);
        eventPublisher.publishEvent(new GraphDeletedEvent(this, id, user.getId()));
    }

    @Transactional
    public KnowledgeGraph calculateComplexity(Long graphId) {
        KnowledgeGraph graph = knowledgeGraphRepository.findById(graphId).orElseThrow(() -> new RuntimeException("Not found"));
        int nodeCount = graph.getNodes().size();
        int edgeCount = graph.getEdges().size();
        
        // Simple mock complexity calculation for demo
        double score = (nodeCount * 0.4) + (edgeCount * 0.6);
        graph.setComplexityScore(score);
        KnowledgeGraph saved = knowledgeGraphRepository.save(graph);
        
        SystemAccount user = graph.getOwner();
        eventPublisher.publishEvent(new ComplexityCalculatedEvent(this, graphId, user != null ? user.getId() : null));
        
        return saved;
    }

    public GraphOrchestratorService() {}

    public GraphOrchestratorService(KnowledgeGraphRepository knowledgeGraphRepository, ApplicationEventPublisher eventPublisher) {
        this.knowledgeGraphRepository = knowledgeGraphRepository;
        this.eventPublisher = eventPublisher;
    }

    public KnowledgeGraph createGraph(KnowledgeGraph graph) {
        KnowledgeGraph saved = knowledgeGraphRepository.save(graph);
        eventPublisher.publishEvent(new GraphCreatedEvent(this, saved.getId(), saved.getOwner() != null ? saved.getOwner().getId() : null));
        return saved;
    }

    public void deleteGraph(KnowledgeGraph graph) {
        knowledgeGraphRepository.deleteById(graph.getId());
        eventPublisher.publishEvent(new GraphDeletedEvent(this, graph.getId(), graph.getOwner() != null ? graph.getOwner().getId() : null));
    }

    public KnowledgeGraph getById(Long id) {
        return knowledgeGraphRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public List<KnowledgeGraph> getAll() {
        return graphService.getAll();
    }

    public List<KnowledgeGraph> getPublicGraphs() {
        return knowledgeGraphRepository.findByIsPublicTrue();
    }
}
