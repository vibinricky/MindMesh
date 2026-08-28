package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record NodeRequestDto(@NotBlank String label, String type, Double xPosition, Double yPosition) { }
