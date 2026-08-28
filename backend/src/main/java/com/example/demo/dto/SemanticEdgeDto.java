package com.example.demo.dto;

public record SemanticEdgeDto(Long id, Long sourceNodeId, Long targetNodeId, String relationshipType, Double weight, Long graphId) { }
