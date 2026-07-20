package com.example.demo.controller;

import com.example.demo.entity.KnowledgeGraph;
import com.example.demo.entity.SemanticEdge;
import com.example.demo.repository.SemanticEdgeRepository;
import com.example.demo.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/edges")
public class EdgeController {

    @Autowired
    private SemanticEdgeRepository semanticEdgeRepository;
    
    @Autowired
    private GraphService graphService;

    @PostMapping
    public ResponseEntity<SemanticEdge> createEdge(@RequestBody SemanticEdge edge) {
        if (edge.getKnowledgeGraph() != null && edge.getKnowledgeGraph().getId() != null) {
            KnowledgeGraph graph = graphService.getGraphById(edge.getKnowledgeGraph().getId());
            edge.setKnowledgeGraph(graph);
        }
        SemanticEdge savedEdge = semanticEdgeRepository.save(edge);
        return ResponseEntity.ok(savedEdge);
    }

    @GetMapping("/graph/{graphId}")
    public ResponseEntity<List<SemanticEdge>> getEdgesForGraph(@PathVariable Long graphId) {
        return ResponseEntity.ok(semanticEdgeRepository.findByKnowledgeGraphId(graphId));
    }
}
