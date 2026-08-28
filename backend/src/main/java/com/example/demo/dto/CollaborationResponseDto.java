package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public record CollaborationResponseDto(@NotNull Long inviteId, boolean accepted) { }
