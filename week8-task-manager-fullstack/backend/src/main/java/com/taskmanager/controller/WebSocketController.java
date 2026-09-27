package com.taskmanager.controller;

import com.taskmanager.model.dto.WebSocketEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    @MessageMapping("/task.update")
    @SendTo("/topic/tasks")
    public WebSocketEventDto handleTaskUpdate(@Payload WebSocketEventDto event, Principal principal) {
        log.info("Received WebSocket task update from {}: {}", 
            principal != null ? principal.getName() : "anonymous", event.type());
        return event;
    }
}
