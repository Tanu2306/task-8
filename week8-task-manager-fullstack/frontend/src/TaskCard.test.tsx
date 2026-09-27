/// <reference types="@testing-library/react" />
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskCard } from './components/kanban/TaskCard';
import { Task } from './types';
import { BrowserRouter } from 'react-router-dom';

const mockTask: Task = {
  id: 1,
  title: 'Test Task Title',
  description: 'Test description content',
  status: 'TODO',
  priority: 'HIGH',
  createdBy: { id: 1, name: 'Alice', email: 'alice@demo.com', role: 'ADMIN', createdAt: '' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  commentCount: 2,
  overdue: false,
};

describe('TaskCard Component', () => {
  it('renders task title and priority badge correctly', () => {
    render(
      <BrowserRouter>
        <TaskCard task={mockTask} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });
});
