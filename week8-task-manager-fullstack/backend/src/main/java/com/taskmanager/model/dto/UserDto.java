package com.taskmanager.model.dto;

import com.taskmanager.model.enums.Role;
import java.time.LocalDateTime;

public record UserDto(
    Long id,
    String name,
    String email,
    Role role,
    String avatarUrl,
    LocalDateTime createdAt,
    LocalDateTime lastSeen
) {}
