package com.taskmanager.controller;

import com.taskmanager.mapper.EntityMapper;
import com.taskmanager.model.dto.UserDto;
import com.taskmanager.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management and presence endpoints")
public class UserController {

    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    @GetMapping
    @Operation(summary = "Get all users (for task assignment & team view)")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll()
            .stream()
            .map(entityMapper::toUserDto)
            .toList();
        return ResponseEntity.ok(users);
    }
}
