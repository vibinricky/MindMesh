package com.example.demo.controller;

import com.example.demo.dto.EdgeRequestDto;
import com.example.demo.dto.SemanticEdgeDto;
import com.example.demo.service.CanvasService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/edges")
public class EdgeController {
    private final CanvasService canvas;
    public EdgeController(CanvasService canvas) { this.canvas = canvas; }
    @GetMapping("/graph/{graphId}") public List<SemanticEdgeDto> getEdgesForGraph(@PathVariable Long graphId) { return canvas.edges(graphId); }
    @PostMapping public ResponseEntity<SemanticEdgeDto> createEdge(@Valid @RequestBody EdgeRequestDto request) { return ResponseEntity.status(HttpStatus.CREATED).body(canvas.createEdge(request)); }
    @PutMapping("/{edgeId}") public SemanticEdgeDto updateEdge(@PathVariable Long edgeId, @Valid @RequestBody EdgeRequestDto request) { return canvas.updateEdge(edgeId, request); }
    @DeleteMapping("/{edgeId}") @ResponseStatus(HttpStatus.NO_CONTENT) public void deleteEdge(@PathVariable Long edgeId) { canvas.deleteEdge(edgeId); }
}
