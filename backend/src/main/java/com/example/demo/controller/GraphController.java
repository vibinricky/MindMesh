package com.example.demo.controller;

import com.example.demo.dto.GraphDto;
import com.example.demo.entity.ActivityLog;
import com.example.demo.entity.KnowledgeGraph;
import com.example.demo.entity.SystemAccount;
import com.example.demo.repository.ActivityLogRepository;
import com.example.demo.service.GraphOrchestratorService;
import com.example.demo.service.GraphService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/graphs")
@PreAuthorize("isAuthenticated()")
public class GraphController {

    @Autowired
    private GraphService graphService;

    @Autowired
    private GraphOrchestratorService graphOrchestratorService;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @GetMapping
    public ResponseEntity<List<KnowledgeGraph>> getAll() {
        return ResponseEntity.ok(graphOrchestratorService.getAll());
    }

    @GetMapping("/my")
    public ResponseEntity<Page<KnowledgeGraph>> getMyGraphs(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(graphService.getMyGraphs(pageable));
    }

    @GetMapping("/public")
    public ResponseEntity<List<KnowledgeGraph>> getPublicGraphs() {
        return ResponseEntity.ok(graphOrchestratorService.getPublicGraphs());
    }

    @GetMapping("/search")
    public ResponseEntity<Page<KnowledgeGraph>> searchGraphs(@RequestParam String query,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(graphService.searchGraphs(query, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeGraph> getById(@PathVariable Long id) {
        return ResponseEntity.ok(graphOrchestratorService.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<KnowledgeGraph> addGraph(@Valid @RequestBody KnowledgeGraph graph) {
        KnowledgeGraph created = graphOrchestratorService.createGraph(graph);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KnowledgeGraph> updateGraph(@PathVariable Long id, @Valid @RequestBody GraphDto graphDto) {
        KnowledgeGraph updated = graphOrchestratorService.updateGraphWithEvents(id, graphDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        KnowledgeGraph graph = graphOrchestratorService.getById(id);
        graphOrchestratorService.deleteGraph(graph);
        return ResponseEntity.ok("KnowledgeGraph deleted successfully.");
    }

    @PostMapping("/{id}/calculate-complexity")
    @PreAuthorize("hasRole('DOMAIN_ROLE')")
    public ResponseEntity<KnowledgeGraph> calculateComplexity(@PathVariable Long id) {
        KnowledgeGraph graph = graphOrchestratorService.calculateComplexity(id);
        return ResponseEntity.ok(graph);
    }

    @GetMapping("/activity")
    public ResponseEntity<Page<ActivityLog>> getUserActivity(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        SystemAccount currentUser = graphService.getCurrentUser();
        return ResponseEntity.ok(activityLogRepository.findByUserId(currentUser.getId(), pageable));
    }

    @GetMapping("/activity/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ActivityLog>> getAllActivity(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(activityLogRepository.findAll(pageable));
    }
}
