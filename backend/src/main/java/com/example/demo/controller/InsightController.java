package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalNodes", 100);
        stats.put("averageComplexity", 45.5);
        stats.put("networkDensity", 0.75);
        stats.put("publicReach", 1200);
        return ResponseEntity.ok(stats);
    }
}
