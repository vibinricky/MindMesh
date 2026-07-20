package com.example.demo.controller;

import com.example.demo.entity.ConceptNode;
import com.example.demo.entity.KnowledgeGraph;
import com.example.demo.repository.ConceptNodeRepository;
import com.example.demo.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/nodes")
public class NodeController {

    @Autowired
    private ConceptNodeRepository conceptNodeRepository;
    
    @Autowired
    private GraphService graphService;

    @PostMapping("/validate-layout/{graphId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ConceptNode> validateLayoutAndAddNode(@PathVariable Long graphId, @RequestBody ConceptNode node) {
        KnowledgeGraph graph = graphService.getGraphById(graphId);
        node.setKnowledgeGraph(graph);
        // simple validation or offset could be done in SpatialLogicService, skipping for brevity
        ConceptNode savedNode = conceptNodeRepository.save(node);
        return ResponseEntity.ok(savedNode);
    }

    @GetMapping("/graph/{graphId}")
    public ResponseEntity<List<ConceptNode>> getNodesForGraph(@PathVariable Long graphId) {
        return ResponseEntity.ok(conceptNodeRepository.findByKnowledgeGraphId(graphId));
    }
}
