package com.taskmanager.model.dto;

import com.taskmanager.model.enums.NotificationType;
import java.time.LocalDateTime;

public record NotificationDto(
    Long id,
    NotificationType type,
    String message,
    Boolean read,
    Long taskId,
    LocalDateTime createdAt
) {}
