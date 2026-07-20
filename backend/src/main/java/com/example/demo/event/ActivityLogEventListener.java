package com.example.demo.event;

import com.example.demo.entity.ActivityLog;
import com.example.demo.repository.ActivityLogRepository;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ActivityLogEventListener {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogEventListener(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @EventListener
    public void handleGraphCreatedEvent(GraphCreatedEvent event) {
        createLog(event.getGraphId(), event.getUserId(), "CREATE", "Created knowledge graph");
    }

    @EventListener
    public void handleGraphUpdatedEvent(GraphUpdatedEvent event) {
        createLog(event.getGraphId(), event.getUserId(), "UPDATE", "Updated knowledge graph");
    }

    @EventListener
    public void handleGraphDeletedEvent(GraphDeletedEvent event) {
        createLog(event.getGraphId(), event.getUserId(), "DELETE", "Deleted knowledge graph");
    }

    @EventListener
    public void handleComplexityCalculatedEvent(ComplexityCalculatedEvent event) {
        createLog(event.getGraphId(), event.getUserId(), "CALCULATE_COMPLEXITY", "Calculated complexity score");
    }

    private void createLog(Long graphId, Long userId, String action, String details) {
        ActivityLog log = new ActivityLog();
        log.setGraphId(graphId);
        log.setUserId(userId);
        log.setAction(action);
        log.setDetails(details);
        activityLogRepository.save(log);
    }
}
