-- ============================================================
-- V2__seed_data.sql
-- Demo seed data for Task Manager Application
-- ============================================================

-- Demo Users (passwords are BCrypt hashes of "Password123!")
INSERT INTO users (name, email, password, role, created_at, updated_at, last_seen) VALUES
('Alice Johnson',  'alice@demo.com', '$2a$12$rOzJ5P9a5V8K4rTqz6vQ4eQJdZ3xJ1mV8uK1WYV1r7aLxBnMpZ4Ky', 'ADMIN', NOW(), NOW(), NOW()),
('Bob Smith',      'bob@demo.com',   '$2a$12$rOzJ5P9a5V8K4rTqz6vQ4eQJdZ3xJ1mV8uK1WYV1r7aLxBnMpZ4Ky', 'USER',  NOW(), NOW(), NOW() - INTERVAL '2 hours'),
('Carol Williams', 'carol@demo.com', '$2a$12$rOzJ5P9a5V8K4rTqz6vQ4eQJdZ3xJ1mV8uK1WYV1r7aLxBnMpZ4Ky', 'USER',  NOW(), NOW(), NOW() - INTERVAL '1 day');

-- Demo Tasks
INSERT INTO tasks (title, description, status, priority, due_date, created_by, assigned_to, created_at, updated_at) VALUES
('Design new landing page',
 'Create a modern, responsive landing page design with hero section, features, and CTA',
 'IN_PROGRESS', 'HIGH',
 NOW() + INTERVAL '3 days', 1, 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 hour'),

('Set up CI/CD pipeline',
 'Configure GitHub Actions for automated testing and deployment to staging and production',
 'TODO', 'URGENT',
 NOW() + INTERVAL '1 day', 1, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

('Write API documentation',
 'Document all REST API endpoints using OpenAPI/Swagger specification',
 'TODO', 'MEDIUM',
 NOW() + INTERVAL '5 days', 2, 3, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

('Fix authentication bug',
 'Investigate and fix the JWT refresh token expiry issue reported in #42',
 'IN_PROGRESS', 'URGENT',
 NOW() + INTERVAL '12 hours', 1, 2, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '30 minutes'),

('Implement dark mode',
 'Add dark/light mode toggle with system preference detection and localStorage persistence',
 'COMPLETED', 'MEDIUM',
 NOW() - INTERVAL '1 day', 2, 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),

('Database performance optimization',
 'Add missing indexes, optimize slow queries, and implement connection pooling',
 'COMPLETED', 'HIGH',
 NOW() - INTERVAL '2 days', 1, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days'),

('Mobile responsive redesign',
 'Update all components to be fully responsive on mobile and tablet devices',
 'TODO', 'HIGH',
 NOW() + INTERVAL '7 days', 3, 3, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

('Add email notifications',
 'Integrate SendGrid to send email notifications for task assignments and due date reminders',
 'TODO', 'LOW',
 NOW() + INTERVAL '14 days', 1, 3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

('Code review: payment module',
 'Review the new payment integration code for security vulnerabilities and best practices',
 'IN_PROGRESS', 'HIGH',
 NOW() + INTERVAL '2 days', 2, 1, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '2 hours'),

('Update dependencies',
 'Audit and update all npm and maven dependencies to latest stable versions',
 'COMPLETED', 'LOW',
 NOW() - INTERVAL '3 days', 3, 3, NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days'),

('Implement WebSocket notifications',
 'Add real-time push notifications using Spring WebSocket and STOMP protocol',
 'IN_PROGRESS', 'HIGH',
 NOW() + INTERVAL '4 days', 1, 2, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 hours'),

('Write unit tests for task service',
 'Achieve 80%+ test coverage for TaskService including edge cases and error scenarios',
 'TODO', 'MEDIUM',
 NOW() + INTERVAL '6 days', 2, 2, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Demo Comments
INSERT INTO comments (task_id, user_id, content, created_at, updated_at) VALUES
(1, 1, 'I have reviewed the mockups. They look great! Please also include the pricing section.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(1, 2, 'Will do! I''ll add the pricing section and send updated mockups by tomorrow.', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '20 hours'),
(1, 3, 'Can we also add testimonials? Would help with conversion rates.', NOW() - INTERVAL '15 hours', NOW() - INTERVAL '15 hours'),
(4, 1, 'The issue is in JwtTokenProvider.java line 87. The clock skew is not accounted for.', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
(4, 2, 'Good catch! Working on the fix now. Will submit a PR within the hour.', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
(9, 1, 'Please pay special attention to the PCI compliance requirements in the checkout flow.', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
(9, 2, 'Noted. I''ll run OWASP ZAP scan as well. Will share the report.', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours');

-- Demo Notifications
INSERT INTO notifications (user_id, type, message, read, task_id, created_at) VALUES
(2, 'TASK_ASSIGNED', 'Alice Johnson assigned you to "Design new landing page"', false, 1, NOW() - INTERVAL '2 days'),
(2, 'TASK_ASSIGNED', 'Alice Johnson assigned you to "Fix authentication bug"', false, 4, NOW() - INTERVAL '4 hours'),
(2, 'COMMENT_ADDED', 'Alice Johnson commented on "Fix authentication bug"', false, 4, NOW() - INTERVAL '3 hours'),
(1, 'COMMENT_ADDED', 'Bob Smith replied on "Design new landing page"', true, 1, NOW() - INTERVAL '20 hours'),
(1, 'COMMENT_ADDED', 'Carol Williams commented on "Design new landing page"', false, 1, NOW() - INTERVAL '15 hours'),
(3, 'TASK_ASSIGNED', 'Bob Smith assigned you to "Write API documentation"', true, 3, NOW() - INTERVAL '3 days'),
(2, 'TASK_ASSIGNED', 'Alice Johnson assigned you to "Implement WebSocket notifications"', false, 11, NOW() - INTERVAL '3 days'),
(1, 'TASK_UPDATED', 'Bob Smith changed status of "Code review: payment module" to IN_PROGRESS', false, 9, NOW() - INTERVAL '2 hours'),
(2, 'DUE_SOON', 'Task "Set up CI/CD pipeline" is due in less than 24 hours', false, 2, NOW() - INTERVAL '1 hour'),
(1, 'DUE_SOON', 'Task "Fix authentication bug" is due in less than 12 hours', false, 4, NOW() - INTERVAL '30 minutes');
