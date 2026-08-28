package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.ConceptNode;
import com.example.demo.entity.KnowledgeGraph;
import com.example.demo.entity.SemanticEdge;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ConceptNodeRepository;
import com.example.demo.repository.SemanticEdgeRepository;
import com.example.demo.repository.ActivityLogRepository;
import com.example.demo.entity.ActivityLog;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CanvasService {
    private final ConceptNodeRepository nodes;
    private final SemanticEdgeRepository edges;
    private final GraphService graphs;
    private final ActivityLogRepository activityLogs;

    public CanvasService(ConceptNodeRepository nodes, SemanticEdgeRepository edges, GraphService graphs, ActivityLogRepository activityLogs) {
        this.nodes = nodes;
        this.edges = edges;
        this.graphs = graphs;
        this.activityLogs = activityLogs;
    }

    public List<ConceptNodeDto> nodes(Long graphId) {
        graphs.getGraphById(graphId);
        return nodes.findByKnowledgeGraphId(graphId).stream().map(this::nodeDto).toList();
    }

    @Transactional
    public ConceptNodeDto createNode(Long graphId, NodeRequestDto request) {
        KnowledgeGraph graph = graphs.getGraphById(graphId);
        ensureOwner(graph);
        ConceptNode node = new ConceptNode();
        apply(node, request);
        node.setKnowledgeGraph(graph);
        // Flush here so a database/schema issue is reported by this request, not after the response is built.
        ConceptNodeDto created = nodeDto(nodes.saveAndFlush(node));
        log(graph, "CREATE_NODE", "Added node: " + created.label());
        return created;
    }

    @Transactional
    public ConceptNodeDto updateNode(Long nodeId, NodeRequestDto request) {
        ConceptNode node = node(nodeId);
        ensureOwner(node.getKnowledgeGraph());
        apply(node, request);
        ConceptNodeDto updated = nodeDto(nodes.save(node));
        log(node.getKnowledgeGraph(), "UPDATE_NODE", "Updated node: " + updated.label());
        return updated;
    }

    @Transactional
    public void deleteNode(Long nodeId) {
        ConceptNode node = node(nodeId);
        ensureOwner(node.getKnowledgeGraph());
        edges.findByKnowledgeGraphId(node.getKnowledgeGraph().getId()).stream()
                .filter(edge -> nodeId.equals(edge.getSourceNodeId()) || nodeId.equals(edge.getTargetNodeId()))
                .forEach(edges::delete);
        nodes.delete(node);
        log(node.getKnowledgeGraph(), "DELETE_NODE", "Deleted node: " + node.getLabel());
    }

    public List<SemanticEdgeDto> edges(Long graphId) {
        graphs.getGraphById(graphId);
        return edges.findByKnowledgeGraphId(graphId).stream().map(this::edgeDto).toList();
    }

    @Transactional
    public SemanticEdgeDto createEdge(EdgeRequestDto request) {
        KnowledgeGraph graph = graphs.getGraphById(request.graphId());
        ensureOwner(graph);
        validateEdge(request, graph);
        SemanticEdge edge = new SemanticEdge();
        apply(edge, request, graph);
        SemanticEdgeDto created = edgeDto(edges.save(edge));
        log(graph, "CREATE_EDGE", "Added connection: " + created.relationshipType());
        return created;
    }

    @Transactional
    public SemanticEdgeDto updateEdge(Long edgeId, EdgeRequestDto request) {
        SemanticEdge edge = edge(edgeId);
        ensureOwner(edge.getKnowledgeGraph());
        if (!edge.getKnowledgeGraph().getId().equals(request.graphId())) throw new IllegalArgumentException("Graph cannot be changed");
        validateEdge(request, edge.getKnowledgeGraph());
        apply(edge, request, edge.getKnowledgeGraph());
        SemanticEdgeDto updated = edgeDto(edges.save(edge));
        log(edge.getKnowledgeGraph(), "UPDATE_EDGE", "Updated connection: " + updated.relationshipType());
        return updated;
    }

    @Transactional
    public void deleteEdge(Long edgeId) {
        SemanticEdge edge = edge(edgeId);
        ensureOwner(edge.getKnowledgeGraph());
        edges.delete(edge);
        log(edge.getKnowledgeGraph(), "DELETE_EDGE", "Deleted connection: " + edge.getRelationshipType());
    }

    public ConceptNodeDto nodeDto(ConceptNode node) {
        return new ConceptNodeDto(node.getId(), node.getLabel(), node.getType(), node.getXPosition(), node.getYPosition(), node.getKnowledgeGraph().getId());
    }

    public SemanticEdgeDto edgeDto(SemanticEdge edge) {
        return new SemanticEdgeDto(edge.getId(), edge.getSourceNodeId(), edge.getTargetNodeId(), edge.getRelationshipType(), edge.getWeight(), edge.getKnowledgeGraph().getId());
    }

    private ConceptNode node(Long id) { return nodes.findById(id).orElseThrow(() -> new ResourceNotFoundException(id)); }
    private SemanticEdge edge(Long id) { return edges.findById(id).orElseThrow(() -> new ResourceNotFoundException(id)); }
    private void apply(ConceptNode node, NodeRequestDto request) { node.setLabel(request.label().trim()); node.setType(request.type()); node.setXPosition(request.xPosition()); node.setYPosition(request.yPosition()); }
    private void apply(SemanticEdge edge, EdgeRequestDto request, KnowledgeGraph graph) { edge.setSourceNodeId(request.sourceNodeId()); edge.setTargetNodeId(request.targetNodeId()); edge.setRelationshipType(request.relationshipType().trim()); edge.setWeight(request.weight() == null ? 1.0 : request.weight()); edge.setKnowledgeGraph(graph); }
    private void validateEdge(EdgeRequestDto request, KnowledgeGraph graph) {
        if (request.sourceNodeId().equals(request.targetNodeId())) throw new IllegalArgumentException("An edge cannot connect a node to itself");
        ConceptNode source = node(request.sourceNodeId()); ConceptNode target = node(request.targetNodeId());
        if (!source.getKnowledgeGraph().getId().equals(graph.getId()) || !target.getKnowledgeGraph().getId().equals(graph.getId())) throw new IllegalArgumentException("Both nodes must belong to the selected graph");
        boolean duplicate = edges.findByKnowledgeGraphId(graph.getId()).stream().anyMatch(edge -> edge.getSourceNodeId().equals(request.sourceNodeId()) && edge.getTargetNodeId().equals(request.targetNodeId()));
        if (duplicate) throw new IllegalArgumentException("That connection already exists");
    }
    private void ensureOwner(KnowledgeGraph graph) {
        if (!graph.getOwner().getId().equals(graphs.getCurrentUser().getId())) throw new org.springframework.security.access.AccessDeniedException("Only the graph owner can edit this mesh");
    }
    private void log(KnowledgeGraph graph, String action, String details) {
        ActivityLog log = new ActivityLog();
        log.setGraphId(graph.getId());
        log.setUserId(graphs.getCurrentUser().getId());
        log.setAction(action);
        log.setDetails(details);
        activityLogs.save(log);
    }
}
