package com.taskmanager.service;

import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.mapper.EntityMapper;
import com.taskmanager.model.dto.AuthDtos.*;
import com.taskmanager.model.entity.RefreshToken;
import com.taskmanager.model.entity.User;
import com.taskmanager.model.enums.Role;
import com.taskmanager.repository.RefreshTokenRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EntityMapper entityMapper;
    private final WebSocketService webSocketService;

    @Value("${app.jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpirationMs;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder()
            .name(request.name())
            .email(request.email().toLowerCase())
            .password(passwordEncoder.encode(request.password()))
            .role(Role.USER)
            .lastSeen(LocalDateTime.now())
            .build();

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateAccessToken(authentication);
        RefreshToken refreshToken = createRefreshToken(savedUser);

        webSocketService.broadcastPresence(savedUser.getEmail(), true);

        return new AuthResponse(
            accessToken,
            refreshToken.getToken(),
            tokenProvider.getAccessTokenExpiration(),
            entityMapper.toUserDto(savedUser)
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.email().toLowerCase())
            .orElseThrow(() -> new UnauthorizedException("User not found"));

        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = tokenProvider.generateAccessToken(authentication);
        
        // Clean up previous tokens
        refreshTokenRepository.deleteByUser(user);
        RefreshToken refreshToken = createRefreshToken(user);

        webSocketService.broadcastPresence(user.getEmail(), true);

        return new AuthResponse(
            accessToken,
            refreshToken.getToken(),
            tokenProvider.getAccessTokenExpiration(),
            entityMapper.toUserDto(user)
        );
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.refreshToken())
            .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token was expired. Please make a new signin request");
        }

        User user = refreshToken.getUser();
        String newAccessToken = tokenProvider.generateTokenFromEmail(user.getEmail());

        return new AuthResponse(
            newAccessToken,
            refreshToken.getToken(),
            tokenProvider.getAccessTokenExpiration(),
            entityMapper.toUserDto(user)
        );
    }

    @Transactional
    public void logout(String refreshTokenStr, User currentUser) {
        if (refreshTokenStr != null) {
            refreshTokenRepository.deleteByToken(refreshTokenStr);
        }
        if (currentUser != null) {
            currentUser.setLastSeen(LocalDateTime.now());
            userRepository.save(currentUser);
            webSocketService.broadcastPresence(currentUser.getEmail(), false);
        }
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User is not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UnauthorizedException("Authenticated user not found in database"));
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
            .user(user)
            .token(UUID.randomUUID().toString())
            .expiryDate(LocalDateTime.now().plusSeconds(refreshTokenExpirationMs / 1000))
            .build();
        return refreshTokenRepository.save(refreshToken);
    }
}
