package com.example.demo.controller;

import com.example.demo.dto.ConceptNodeDto;
import com.example.demo.dto.NodeRequestDto;
import com.example.demo.service.CanvasService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nodes")
public class NodeController {
    private final CanvasService canvas;
    public NodeController(CanvasService canvas) { this.canvas = canvas; }

    @GetMapping("/graph/{graphId}")
    public List<ConceptNodeDto> getNodesForGraph(@PathVariable Long graphId) { return canvas.nodes(graphId); }

    @PostMapping("/graph/{graphId}")
    public ResponseEntity<ConceptNodeDto> createNode(@PathVariable Long graphId, @Valid @RequestBody NodeRequestDto request) { return ResponseEntity.status(HttpStatus.CREATED).body(canvas.createNode(graphId, request)); }

    @PutMapping("/{nodeId}")
    public ConceptNodeDto updateNode(@PathVariable Long nodeId, @Valid @RequestBody NodeRequestDto request) { return canvas.updateNode(nodeId, request); }

    @DeleteMapping("/{nodeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNode(@PathVariable Long nodeId) { canvas.deleteNode(nodeId); }

    /** Kept as a compatibility alias for the original canvas endpoint. */
    @PostMapping("/validate-layout/{graphId}")
    public ResponseEntity<ConceptNodeDto> validateLayoutAndAddNode(@PathVariable Long graphId, @Valid @RequestBody NodeRequestDto request) { return ResponseEntity.status(HttpStatus.CREATED).body(canvas.createNode(graphId, request)); }
}
