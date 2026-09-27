package com.taskmanager;

import com.taskmanager.mapper.EntityMapper;
import com.taskmanager.model.dto.CommentDtos.*;
import com.taskmanager.model.entity.Comment;
import com.taskmanager.model.entity.Task;
import com.taskmanager.model.entity.User;
import com.taskmanager.model.enums.Role;

import com.taskmanager.repository.CommentRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.service.CommentService;
import com.taskmanager.service.NotificationService;
import com.taskmanager.service.WebSocketService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private TaskRepository taskRepository;

    @Spy
    private EntityMapper entityMapper = new EntityMapper();

    @Mock
    private NotificationService notificationService;

    @Mock
    private WebSocketService webSocketService;

    @InjectMocks
    private CommentService commentService;

    private User testUser;
    private Task testTask;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Alice Johnson");
        testUser.setEmail("alice@demo.com");
        testUser.setRole(Role.ADMIN);

        testTask = new Task();
        testTask.setId(10L);
        testTask.setTitle("Test Task Title");
        testTask.setCreatedBy(testUser);
    }

    @Test
    @DisplayName("Should create comment successfully")
    void createComment_Success() {
        CreateCommentRequest request = new CreateCommentRequest("Great work on this task!");

        when(taskRepository.findById(10L)).thenReturn(Optional.of(testTask));
        
        Comment savedComment = new Comment();
        savedComment.setId(100L);
        savedComment.setContent("Great work on this task!");
        savedComment.setTask(testTask);
        savedComment.setUser(testUser);
        savedComment.setCreatedAt(LocalDateTime.now());
        savedComment.setUpdatedAt(LocalDateTime.now());

        when(commentRepository.save(any(Comment.class))).thenReturn(savedComment);

        CommentResponse response = commentService.addComment(10L, request, testUser);

        assertNotNull(response);
        assertEquals("Great work on this task!", response.content());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    @DisplayName("Should get comments by task ID")
    void getCommentsByTaskId_Success() {
        Comment comment = new Comment();
        comment.setId(100L);
        comment.setContent("Comment 1");
        comment.setTask(testTask);
        comment.setUser(testUser);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        when(taskRepository.existsById(10L)).thenReturn(true);
        when(commentRepository.findByTaskIdOrderByCreatedAtAsc(10L)).thenReturn(List.of(comment));

        List<CommentResponse> comments = commentService.getTaskComments(10L);

        assertEquals(1, comments.size());
        assertEquals("Comment 1", comments.get(0).content());
    }
}
