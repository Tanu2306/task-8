package com.taskmanager.service;

import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.mapper.EntityMapper;
import com.taskmanager.model.dto.TaskDtos.*;
import com.taskmanager.model.entity.Task;
import com.taskmanager.model.entity.User;
import com.taskmanager.model.enums.NotificationType;
import com.taskmanager.model.enums.Priority;
import com.taskmanager.model.enums.TaskStatus;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;
    private final WebSocketService webSocketService;
    private final NotificationService notificationService;

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request, User currentUser) {
        User assignedTo = null;
        if (request.assignedToId() != null) {
            assignedTo = userRepository.findById(request.assignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found", request.assignedToId()));
        }

        Task task = Task.builder()
            .title(request.title())
            .description(request.description())
            .priority(request.priority())
            .status(request.status() != null ? request.status() : TaskStatus.TODO)
            .dueDate(request.dueDate())
            .createdBy(currentUser)
            .assignedTo(assignedTo)
            .build();

        Task savedTask = taskRepository.save(task);
        TaskResponse response = entityMapper.toTaskResponse(savedTask);

        // Broadcast WS event
        webSocketService.broadcastTaskEvent("TASK_CREATED", response, currentUser.getEmail());

        // Notify assigned user if applicable
        if (assignedTo != null && !assignedTo.getId().equals(currentUser.getId())) {
            notificationService.createAndSendNotification(
                assignedTo,
                NotificationType.TASK_ASSIGNED,
                currentUser.getName() + " assigned you to task: \"" + task.getTitle() + "\"",
                savedTask
            );
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(TaskFilterRequest filter) {
        String search = (filter != null && filter.search() != null && !filter.search().isBlank()) 
            ? filter.search() : null;
        TaskStatus status = filter != null ? filter.status() : null;
        Priority priority = filter != null ? filter.priority() : null;
        Long assignedToId = filter != null ? filter.assignedToId() : null;

        List<Task> tasks = taskRepository.findByFilters(search, status, priority, assignedToId);

        // Sort in memory if requested
        if (filter != null && filter.sortBy() != null) {
            boolean asc = "asc".equalsIgnoreCase(filter.sortDirection());
            tasks.sort((t1, t2) -> {
                int cmp = 0;
                switch (filter.sortBy().toLowerCase()) {
                    case "priority" -> cmp = t1.getPriority().compareTo(t2.getPriority());
                    case "duedate" -> {
                        if (t1.getDueDate() == null) return 1;
                        if (t2.getDueDate() == null) return -1;
                        cmp = t1.getDueDate().compareTo(t2.getDueDate());
                    }
                    case "oldest" -> cmp = t1.getCreatedAt().compareTo(t2.getCreatedAt());
                    default -> cmp = t2.getCreatedAt().compareTo(t1.getCreatedAt()); // default newest
                }
                return asc ? cmp : -cmp;
            });
        }

        return tasks.stream().map(entityMapper::toTaskResponse).toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        return entityMapper.toTaskResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long id, UpdateTaskRequest request, User currentUser) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        if (request.title() != null) task.setTitle(request.title());
        if (request.description() != null) task.setDescription(request.description());
        if (request.priority() != null) task.setPriority(request.priority());
        if (request.status() != null) task.setStatus(request.status());
        if (request.dueDate() != null) task.setDueDate(request.dueDate());

        if (request.assignedToId() != null) {
            User newAssignee = userRepository.findById(request.assignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.assignedToId()));
            
            if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(newAssignee.getId())) {
                task.setAssignedTo(newAssignee);
                if (!newAssignee.getId().equals(currentUser.getId())) {
                    notificationService.createAndSendNotification(
                        newAssignee,
                        NotificationType.TASK_ASSIGNED,
                        currentUser.getName() + " assigned you to task: \"" + task.getTitle() + "\"",
                        task
                    );
                }
            }
        }

        Task updatedTask = taskRepository.save(task);
        TaskResponse response = entityMapper.toTaskResponse(updatedTask);

        webSocketService.broadcastTaskEvent("TASK_UPDATED", response, currentUser.getEmail());
        return response;
    }

    @Transactional
    public TaskResponse updateStatus(Long id, UpdateStatusRequest request, User currentUser) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        TaskStatus oldStatus = task.getStatus();
        task.setStatus(request.status());
        Task updatedTask = taskRepository.save(task);

        TaskResponse response = entityMapper.toTaskResponse(updatedTask);

        // Broadcast WS
        Map<String, Object> payload = Map.of(
            "taskId", id,
            "oldStatus", oldStatus,
            "newStatus", request.status(),
            "updatedBy", currentUser.getEmail(),
            "task", response
        );
        webSocketService.broadcastTaskEvent("TASK_STATUS_CHANGED", payload, currentUser.getEmail());

        // Send notification to task creator or assignee if updated by another user
        if (task.getCreatedBy() != null && !task.getCreatedBy().getId().equals(currentUser.getId())) {
            notificationService.createAndSendNotification(
                task.getCreatedBy(),
                NotificationType.STATUS_CHANGED,
                currentUser.getName() + " changed status of \"" + task.getTitle() + "\" to " + request.status(),
                task
            );
        }

        return response;
    }

    @Transactional
    public void deleteTask(Long id, User currentUser) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        taskRepository.delete(task);

        Map<String, Object> payload = Map.of("taskId", id, "deletedBy", currentUser.getEmail());
        webSocketService.broadcastTaskEvent("TASK_DELETED", payload, currentUser.getEmail());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        long total = taskRepository.count();
        long todo = taskRepository.countByStatus(TaskStatus.TODO);
        long inProgress = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long completed = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long overdue = taskRepository.countOverdue(LocalDateTime.now());

        double completionPercentage = total > 0 ? (double) completed / total * 100 : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTasks", total);
        stats.put("todoTasks", todo);
        stats.put("inProgressTasks", inProgress);
        stats.put("completedTasks", completed);
        stats.put("overdueTasks", overdue);
        stats.put("completionPercentage", Math.round(completionPercentage * 10.0) / 10.0);

        return stats;
    }
}
