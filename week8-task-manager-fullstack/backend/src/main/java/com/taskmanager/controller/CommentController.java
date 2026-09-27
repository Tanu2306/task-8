package com.taskmanager.controller;

import com.taskmanager.model.dto.CommentDtos.*;
import com.taskmanager.model.entity.User;
import com.taskmanager.service.AuthService;
import com.taskmanager.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Task comments management endpoints")
public class CommentController {

    private final CommentService commentService;
    private final AuthService authService;

    @GetMapping("/tasks/{taskId}/comments")
    @Operation(summary = "Get all comments for a specific task")
    public ResponseEntity<List<CommentResponse>> getTaskComments(@PathVariable Long taskId) {
        List<CommentResponse> comments = commentService.getTaskComments(taskId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/tasks/{taskId}/comments")
    @Operation(summary = "Add a comment to a task")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CreateCommentRequest request) {
        User currentUser = authService.getCurrentUser();
        CommentResponse response = commentService.addComment(taskId, request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/comments/{id}")
    @Operation(summary = "Update an existing comment")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCommentRequest request) {
        User currentUser = authService.getCurrentUser();
        CommentResponse response = commentService.updateComment(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/comments/{id}")
    @Operation(summary = "Delete a comment")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        commentService.deleteComment(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
