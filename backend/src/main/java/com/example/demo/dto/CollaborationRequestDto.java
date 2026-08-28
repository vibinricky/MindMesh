package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CollaborationRequestDto(@NotNull Long graphId, @NotBlank String inviteeUsername) { }
