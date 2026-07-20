package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/collab")
public class CollaborationController {

    @PostMapping("/respond")
    public ResponseEntity<String> respondToInvite(@RequestBody Map<String, String> response) {
        // Implementation for collaboration invite response
        String status = response.get("status");
        return ResponseEntity.ok("Responded with status: " + status);
    }
}
