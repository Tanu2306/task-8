package com.taskmanager.service;

import com.taskmanager.model.dto.WebSocketEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastTaskEvent(String eventType, Object payload, String username) {
        WebSocketEventDto event = new WebSocketEventDto(eventType, payload, username);
        log.info("Broadcasting task event: {} to /topic/tasks", eventType);
        messagingTemplate.convertAndSend("/topic/tasks", event);
    }

    public void sendNotificationToUser(Long userId, Object notification) {
        log.info("Sending notification event to user: {}", userId);
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, notification);
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }

    public void broadcastPresence(String userEmail, boolean online) {
        WebSocketEventDto event = new WebSocketEventDto(
            online ? "USER_ONLINE" : "USER_OFFLINE",
            userEmail,
            userEmail
        );
        messagingTemplate.convertAndSend("/topic/presence", event);
    }
}
