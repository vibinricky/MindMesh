package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequestDto(
        @NotBlank @Size(min = 3, max = 100) String username,
        @NotBlank @Size(min = 4, max = 100) String password,
        @NotBlank @Pattern(regexp = "ROLE_(ANALYST|RESEARCH_STRATEGIST)") String role) { }
