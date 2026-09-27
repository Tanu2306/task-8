package com.taskmanager.mapper;

import com.taskmanager.model.dto.*;
import com.taskmanager.model.entity.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class EntityMapper {

    public UserDto toUserDto(User user) {
        if (user == null) return null;
        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getAvatarUrl(),
            user.getCreatedAt(),
            user.getLastSeen()
        );
    }

    public TaskDtos.TaskResponse toTaskResponse(Task task) {
        if (task == null) return null;
        boolean isOverdue = task.getDueDate() != null 
            && task.getDueDate().isBefore(LocalDateTime.now()) 
            && task.getStatus() != com.taskmanager.model.enums.TaskStatus.COMPLETED;

        int commentCount = task.getComments() != null ? task.getComments().size() : 0;

        return new TaskDtos.TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getPriority(),
            task.getDueDate(),
            toUserDto(task.getCreatedBy()),
            toUserDto(task.getAssignedTo()),
            task.getCreatedAt(),
            task.getUpdatedAt(),
            commentCount,
            isOverdue
        );
    }

    public CommentDtos.CommentResponse toCommentResponse(Comment comment) {
        if (comment == null) return null;
        return new CommentDtos.CommentResponse(
            comment.getId(),
            comment.getTask().getId(),
            toUserDto(comment.getUser()),
            comment.getContent(),
            comment.getCreatedAt(),
            comment.getUpdatedAt()
        );
    }

    public NotificationDto toNotificationDto(Notification notification) {
        if (notification == null) return null;
        return new NotificationDto(
            notification.getId(),
            notification.getType(),
            notification.getMessage(),
            notification.getRead(),
            notification.getTask() != null ? notification.getTask().getId() : null,
            notification.getCreatedAt()
        );
    }
}
