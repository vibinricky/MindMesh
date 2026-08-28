package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public record GraphDetailDto(Long id, String title, String description, String domain, Boolean isPublic,
                             Double complexityScore, LocalDateTime createdAt, Long ownerId, String ownerUsername,
                             List<ConceptNodeDto> nodes, List<SemanticEdgeDto> edges) { }
