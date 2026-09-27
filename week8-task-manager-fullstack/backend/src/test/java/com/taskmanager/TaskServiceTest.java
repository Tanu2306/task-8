package com.taskmanager;

import com.taskmanager.mapper.EntityMapper;
import com.taskmanager.model.dto.TaskDtos.*;
import com.taskmanager.model.entity.Task;
import com.taskmanager.model.entity.User;
import com.taskmanager.model.enums.Priority;
import com.taskmanager.model.enums.Role;
import com.taskmanager.model.enums.TaskStatus;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.NotificationService;
import com.taskmanager.service.TaskService;
import com.taskmanager.service.WebSocketService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EntityMapper entityMapper;

    @Mock
    private WebSocketService webSocketService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TaskService taskService;

    @Test
    @DisplayName("Should create task successfully")
    void createTask_ValidRequest_Success() {
        User user = User.builder().id(1L).email("user@example.com").name("User").role(Role.USER).build();
        CreateTaskRequest request = new CreateTaskRequest("New Task", "Desc", Priority.HIGH, TaskStatus.TODO, null, LocalDateTime.now().plusDays(1));
        
        Task savedTask = Task.builder().id(10L).title("New Task").status(TaskStatus.TODO).priority(Priority.HIGH).createdBy(user).build();
        TaskResponse response = new TaskResponse(10L, "New Task", "Desc", TaskStatus.TODO, Priority.HIGH, null, null, null, LocalDateTime.now(), LocalDateTime.now(), 0, false);

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);
        when(entityMapper.toTaskResponse(savedTask)).thenReturn(response);

        TaskResponse result = taskService.createTask(request, user);

        assertNotNull(result);
        assertEquals("New Task", result.title());
        verify(webSocketService).broadcastTaskEvent(eq("TASK_CREATED"), any(), eq("user@example.com"));
    }
}
