package com.example.demo.dto;

import java.time.LocalDateTime;

/** A safe, stable payload for graph listings (rather than serialising JPA entities). */
public record GraphSummaryDto(Long id, String title, String description, String domain, Boolean isPublic,
                              Double complexityScore, LocalDateTime createdAt, Long ownerId, String ownerUsername) { }
