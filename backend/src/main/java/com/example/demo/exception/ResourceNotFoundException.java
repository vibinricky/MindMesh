package com.example.demo.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(Long id) {
        super("KnowledgeGraph not found with id: " + id);
    }
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
