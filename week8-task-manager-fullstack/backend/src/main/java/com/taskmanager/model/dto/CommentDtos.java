package com.taskmanager.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class CommentDtos {

    public record CreateCommentRequest(
        @NotBlank(message = "Comment content is required")
        @Size(min = 1, max = 5000, message = "Comment must be between 1 and 5000 characters")
        String content
    ) {}

    public record UpdateCommentRequest(
        @NotBlank(message = "Comment content is required")
        @Size(min = 1, max = 5000, message = "Comment must be between 1 and 5000 characters")
        String content
    ) {}

    public record CommentResponse(
        Long id,
        Long taskId,
        UserDto user,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {}
}
