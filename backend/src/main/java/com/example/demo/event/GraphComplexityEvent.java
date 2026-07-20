package com.example.demo.event;

import org.springframework.context.ApplicationEvent;

public class GraphComplexityEvent extends ApplicationEvent {
    public GraphComplexityEvent(Object source) {
        super(source);
    }
}
