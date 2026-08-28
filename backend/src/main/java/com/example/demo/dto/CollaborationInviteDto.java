package com.example.demo.dto;

import java.time.LocalDateTime;

public record CollaborationInviteDto(Long id, Long graphId, String graphTitle, Long inviterId, String inviterUsername,
                                     Long inviteeId, String inviteeUsername, String status, LocalDateTime createdAt) { }
