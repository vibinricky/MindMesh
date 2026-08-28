package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.CollaborationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/collab")
public class CollaborationController {
    private final CollaborationService collaboration;
    public CollaborationController(CollaborationService collaboration) { this.collaboration = collaboration; }
    @PostMapping("/invite") public ResponseEntity<CollaborationInviteDto> invite(@Valid @RequestBody CollaborationRequestDto request) { return ResponseEntity.status(HttpStatus.CREATED).body(collaboration.invite(request)); }
    @GetMapping("/pending") public List<CollaborationInviteDto> pending() { return collaboration.pending(); }
    @GetMapping("/graph/{graphId}") public List<CollaborationInviteDto> graphInvites(@PathVariable Long graphId) { return collaboration.graphInvites(graphId); }
    @PostMapping("/respond") public CollaborationInviteDto respond(@Valid @RequestBody CollaborationResponseDto request) { return collaboration.respond(request.inviteId(), request.accepted()); }
}
