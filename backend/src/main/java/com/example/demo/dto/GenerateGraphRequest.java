package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GenerateGraphRequest(
    @NotBlank(message = "Prompt cannot be blank")
    @Size(min = 2, max = 500, message = "Prompt must be between 2 and 500 characters")
    String prompt,
    Boolean isPublic
) {}
