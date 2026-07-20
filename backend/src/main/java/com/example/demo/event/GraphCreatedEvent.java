package com.example.demo.event;

import org.springframework.context.ApplicationEvent;

public class GraphCreatedEvent extends ApplicationEvent {
    private final Long graphId;
    private final Long userId;

    public GraphCreatedEvent(Object source, Long graphId, Long userId) {
        super(source);
        this.graphId = graphId;
        this.userId = userId;
    }

    public Long getGraphId() { return graphId; }
    public Long getUserId() { return userId; }
}
