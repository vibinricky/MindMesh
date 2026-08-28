package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import com.example.demo.dto.PlatformStatsDto;
import com.example.demo.service.InsightService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/insights")
public class InsightController {
    private final InsightService insightService;
    public InsightController(InsightService insightService) { this.insightService = insightService; }

    @GetMapping("/stats")
    public ResponseEntity<PlatformStatsDto> getStats() {
        return ResponseEntity.ok(insightService.stats());
    }
}
