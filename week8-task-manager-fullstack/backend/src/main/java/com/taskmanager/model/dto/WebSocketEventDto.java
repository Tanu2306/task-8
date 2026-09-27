package com.taskmanager.model.dto;

import java.time.LocalDateTime;

public record WebSocketEventDto(
    String type,
    Object payload,
    String triggeredBy,
    LocalDateTime timestamp
) {
    public WebSocketEventDto(String type, Object payload, String triggeredBy) {
        this(type, payload, triggeredBy, LocalDateTime.now());
    }
}
