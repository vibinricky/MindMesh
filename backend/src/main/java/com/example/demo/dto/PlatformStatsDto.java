package com.example.demo.dto;

public record PlatformStatsDto(long totalGraphs, long publicGraphs, long totalNodes, long totalEdges,
                               double averageComplexity, double networkDensity, long totalUsers, long publicReach) { }
