package com.example.demo.service;

import com.example.demo.dto.PlatformStatsDto;
import com.example.demo.repository.ConceptNodeRepository;
import com.example.demo.repository.KnowledgeGraphRepository;
import com.example.demo.repository.SemanticEdgeRepository;
import com.example.demo.repository.SystemAccountRepository;
import org.springframework.stereotype.Service;

@Service
public class InsightService {
    private final KnowledgeGraphRepository graphs; private final ConceptNodeRepository nodes; private final SemanticEdgeRepository edges; private final SystemAccountRepository accounts;
    public InsightService(KnowledgeGraphRepository graphs, ConceptNodeRepository nodes, SemanticEdgeRepository edges, SystemAccountRepository accounts) { this.graphs = graphs; this.nodes = nodes; this.edges = edges; this.accounts = accounts; }
    public PlatformStatsDto stats() {
        long graphCount = graphs.count(), nodeCount = nodes.count(), edgeCount = edges.count();
        double average = graphs.findAll().stream().mapToDouble(graph -> graph.getComplexityScore() == null ? 0 : graph.getComplexityScore()).average().orElse(0);
        double density = nodeCount < 2 ? 0 : Math.min(1, (2.0 * edgeCount) / (nodeCount * (nodeCount - 1)));
        long publicGraphs = graphs.findByIsPublicTrue().size();
        return new PlatformStatsDto(graphCount, publicGraphs, nodeCount, edgeCount, average, density, accounts.count(), publicGraphs);
    }
}
