package com.taskmanager.service;

import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.mapper.EntityMapper;
import com.taskmanager.model.dto.CommentDtos.*;
import com.taskmanager.model.entity.Comment;
import com.taskmanager.model.entity.Task;
import com.taskmanager.model.entity.User;
import com.taskmanager.model.enums.NotificationType;
import com.taskmanager.repository.CommentRepository;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final EntityMapper entityMapper;
    private final WebSocketService webSocketService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<CommentResponse> getTaskComments(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new ResourceNotFoundException("Task", taskId);
        }
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId)
            .stream()
            .map(entityMapper::toCommentResponse)
            .toList();
    }

    @Transactional
    public CommentResponse addComment(Long taskId, CreateCommentRequest request, User currentUser) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));

        Comment comment = Comment.builder()
            .task(task)
            .user(currentUser)
            .content(request.content())
            .build();

        Comment saved = commentRepository.save(comment);
        CommentResponse response = entityMapper.toCommentResponse(saved);

        // WS Broadcast
        webSocketService.broadcastTaskEvent("COMMENT_ADDED", response, currentUser.getEmail());

        // Notify task creator and assignee
        if (task.getCreatedBy() != null && !task.getCreatedBy().getId().equals(currentUser.getId())) {
            notificationService.createAndSendNotification(
                task.getCreatedBy(),
                NotificationType.COMMENT_ADDED,
                currentUser.getName() + " commented on \"" + task.getTitle() + "\"",
                task
            );
        }

        return response;
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, UpdateCommentRequest request, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(request.content());
        Comment updated = commentRepository.save(comment);
        CommentResponse response = entityMapper.toCommentResponse(updated);

        webSocketService.broadcastTaskEvent("COMMENT_UPDATED", response, currentUser.getEmail());
        return response;
    }

    @Transactional
    public void deleteComment(Long commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        if (!comment.getUser().getId().equals(currentUser.getId()) 
            && !currentUser.getRole().name().equals("ADMIN")) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        Long taskId = comment.getTask().getId();
        commentRepository.delete(comment);

        Map<String, Object> payload = Map.of("commentId", commentId, "taskId", taskId);
        webSocketService.broadcastTaskEvent("COMMENT_DELETED", payload, currentUser.getEmail());
    }
}
