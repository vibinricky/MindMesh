package com.example.demo.controller;

import com.example.demo.dto.GraphDto;
import com.example.demo.dto.GraphDetailDto;
import com.example.demo.dto.GraphSummaryDto;
import com.example.demo.dto.ActivityLogDto;
import com.example.demo.entity.ActivityLog;
import com.example.demo.entity.KnowledgeGraph;
import com.example.demo.entity.SystemAccount;
import com.example.demo.repository.ActivityLogRepository;
import com.example.demo.repository.SystemAccountRepository;
import com.example.demo.service.GraphOrchestratorService;
import com.example.demo.service.GraphService;
import com.example.demo.service.CanvasService;
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
public class GraphController {

    @Autowired
    private GraphService graphService;

    @Autowired
    private GraphOrchestratorService graphOrchestratorService;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private CanvasService canvasService;

    @Autowired
    private SystemAccountRepository systemAccountRepository;

    public GraphController() {}

    public GraphController(GraphOrchestratorService graphOrchestratorService) {
        this.graphOrchestratorService = graphOrchestratorService;
    }

    @GetMapping
    public ResponseEntity<List<KnowledgeGraph>> getAll() {
        return ResponseEntity.ok(graphOrchestratorService.getAll());
    }

    @GetMapping("/my")
    public ResponseEntity<Page<GraphSummaryDto>> getMyGraphs(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(graphService.getMyGraphs(pageable).map(this::summary));
    }

    @GetMapping("/public")
    public ResponseEntity<List<GraphSummaryDto>> getPublicGraphs() {
        return ResponseEntity.ok(graphOrchestratorService.getPublicGraphs().stream().map(this::summary).toList());
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

    @GetMapping("/{id}/full")
    public ResponseEntity<GraphDetailDto> getFullGraph(@PathVariable Long id) {
        KnowledgeGraph graph = graphOrchestratorService.getById(id);
        return ResponseEntity.ok(new GraphDetailDto(graph.getId(), graph.getTitle(), graph.getDescription(), graph.getDomain(),
                graph.getIsPublic(), graph.getComplexityScore(), graph.getCreatedAt(), graph.getOwner().getId(),
                graph.getOwner().getUsername(), canvasService.nodes(id), canvasService.edges(id)));
    }

    @PostMapping
    public ResponseEntity<KnowledgeGraph> createGraph(@Valid @RequestBody KnowledgeGraph graph) {
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
        graphOrchestratorService.deleteById(id);
        return ResponseEntity.ok("KnowledgeGraph deleted successfully.");
    }

    @PostMapping("/{id}/calculate-complexity")
    @PreAuthorize("hasAuthority('ROLE_RESEARCH_STRATEGIST')")
    public ResponseEntity<KnowledgeGraph> calculateComplexity(@PathVariable Long id) {
        KnowledgeGraph graph = graphOrchestratorService.calculateComplexity(id);
        return ResponseEntity.ok(graph);
    }

    @GetMapping("/activity")
    public ResponseEntity<Page<ActivityLogDto>> getUserActivity(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        SystemAccount currentUser = graphService.getCurrentUser();
        return ResponseEntity.ok(activityLogRepository.findByUserId(currentUser.getId(), pageable).map(this::activity));
    }

    @GetMapping("/activity/all")
    @PreAuthorize("hasAuthority('ROLE_RESEARCH_STRATEGIST')")
    public ResponseEntity<Page<ActivityLogDto>> getAllActivity(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(activityLogRepository.findAll(pageable).map(this::activity));
    }

    private GraphSummaryDto summary(KnowledgeGraph graph) {
        SystemAccount owner = graph.getOwner();
        return new GraphSummaryDto(graph.getId(), graph.getTitle(), graph.getDescription(), graph.getDomain(),
                graph.getIsPublic(), graph.getComplexityScore(), graph.getCreatedAt(),
                owner == null ? null : owner.getId(), owner == null ? null : owner.getUsername());
    }

    private ActivityLogDto activity(ActivityLog log) {
        String username = log.getUserId() == null ? null : systemAccountRepository.findById(log.getUserId())
                .map(SystemAccount::getUsername).orElse(null);
        return new ActivityLogDto(log.getId(), log.getGraphId(), log.getUserId(), username,
                log.getAction(), log.getTimestamp(), log.getDetails());
    }
}
