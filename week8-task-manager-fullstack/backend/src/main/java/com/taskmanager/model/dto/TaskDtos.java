package com.taskmanager.model.dto;

import com.taskmanager.model.enums.Priority;
import com.taskmanager.model.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class TaskDtos {

    public record CreateTaskRequest(
        @NotBlank(message = "Title is required")
        @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
        String title,

        String description,

        @NotNull(message = "Priority is required")
        Priority priority,

        TaskStatus status,

        Long assignedToId,

        LocalDateTime dueDate
    ) {}

    public record UpdateTaskRequest(
        @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
        String title,

        String description,

        Priority priority,

        TaskStatus status,

        Long assignedToId,

        LocalDateTime dueDate
    ) {}

    public record UpdateStatusRequest(
        @NotNull(message = "Status is required")
        TaskStatus status
    ) {}

    public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        Priority priority,
        LocalDateTime dueDate,
        UserDto createdBy,
        UserDto assignedTo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        int commentCount,
        boolean overdue
    ) {}

    public record TaskFilterRequest(
        String search,
        TaskStatus status,
        Priority priority,
        Long assignedToId,
        LocalDateTime dueDateFrom,
        LocalDateTime dueDateTo,
        String sortBy,
        String sortDirection
    ) {}
}
