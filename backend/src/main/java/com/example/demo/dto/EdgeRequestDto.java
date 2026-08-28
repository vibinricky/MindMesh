package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EdgeRequestDto(@NotNull Long sourceNodeId, @NotNull Long targetNodeId, @NotBlank String relationshipType, Double weight, @NotNull Long graphId) { }
