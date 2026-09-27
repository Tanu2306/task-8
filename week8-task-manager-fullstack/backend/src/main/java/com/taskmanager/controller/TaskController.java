package com.taskmanager.controller;

import com.taskmanager.model.dto.TaskDtos.*;
import com.taskmanager.model.entity.User;
import com.taskmanager.model.enums.Priority;
import com.taskmanager.model.enums.TaskStatus;
import com.taskmanager.service.AuthService;
import com.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task management CRUD & search endpoints")
public class TaskController {

    private final TaskService taskService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get all tasks with optional search, filter, and sorting")
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDirection) {

        TaskFilterRequest filter = new TaskFilterRequest(
            search, status, priority, assignedToId, null, null, sortBy, sortDirection
        );
        List<TaskResponse> tasks = taskService.getAllTasks(filter);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        User currentUser = authService.getCurrentUser();
        TaskResponse response = taskService.createTask(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task details by ID")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        TaskResponse response = taskService.getTaskById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing task")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request) {
        User currentUser = authService.getCurrentUser();
        TaskResponse response = taskService.updateTask(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update task status (Kanban drag-and-drop)")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        User currentUser = authService.getCurrentUser();
        TaskResponse response = taskService.updateStatus(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task by ID")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        taskService.deleteTask(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    @Operation(summary = "Get task productivity statistics for dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = taskService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
