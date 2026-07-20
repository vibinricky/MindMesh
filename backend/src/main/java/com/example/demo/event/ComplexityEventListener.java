package com.example.demo.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ComplexityEventListener {
    @EventListener
    public void handleGraphComplexityEvent(GraphComplexityEvent event) {
        // Implementation
    }
}
