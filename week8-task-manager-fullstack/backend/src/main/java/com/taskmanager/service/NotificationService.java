package com.taskmanager.service;

import com.taskmanager.mapper.EntityMapper;
import com.taskmanager.model.dto.NotificationDto;
import com.taskmanager.model.entity.Notification;
import com.taskmanager.model.entity.Task;
import com.taskmanager.model.entity.User;
import com.taskmanager.model.enums.NotificationType;
import com.taskmanager.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EntityMapper entityMapper;
    private final WebSocketService webSocketService;

    @Transactional
    public void createAndSendNotification(User recipient, NotificationType type, String message, Task task) {
        if (recipient == null) return;

        Notification notification = Notification.builder()
            .user(recipient)
            .type(type)
            .message(message)
            .read(false)
            .task(task)
            .build();

        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = entityMapper.toNotificationDto(saved);

        webSocketService.sendNotificationToUser(recipient.getId(), dto);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
            .stream()
            .map(entityMapper::toNotificationDto)
            .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notificationRepository.countUnreadByUserId(user.getId());
    }

    @Transactional
    public NotificationDto markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to update this notification");
        }

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return entityMapper.toNotificationDto(updated);
    }

    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadForUser(user.getId());
    }
}
