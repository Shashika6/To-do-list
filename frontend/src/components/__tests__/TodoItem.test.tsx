import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoItem from '../TodoItem';
import { Priority, Recurrence } from '../../services/api';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    priority: Priority.MEDIUM,
    status: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nextOccurrence: new Date().toISOString(),
    dependencies: [],
    recurrence: Recurrence.NONE
  };

  const mockToggleTodo = vi.fn();
  const mockUpdatePriority = vi.fn();
  const mockDeleteTodo = vi.fn();

  const renderTodoItem = (props = {}) => {
    return render(
      <TodoItem
        todo={mockTodo}
        toggleTodo={mockToggleTodo}
        updateTodoPriority={mockUpdatePriority}
        deleteTodo={mockDeleteTodo}
        isLoading={false}
        {...props}
      />
    );
  };

  it('renders todo item correctly', () => {
    renderTodoItem();
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    const priorityTag = screen.getByText('Medium', { 
      selector: '.todo-item__priority-tag' 
    });
    expect(priorityTag).toBeInTheDocument();
    expect(priorityTag).toHaveClass('todo-item__priority-tag--medium');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls toggleTodo when checkbox is clicked', () => {
    renderTodoItem();
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockToggleTodo).toHaveBeenCalledWith('1');
  });

  it('calls deleteTodo when delete button is clicked', () => {
    renderTodoItem();
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockDeleteTodo).toHaveBeenCalledWith('1');
  });

  it('disables controls when isLoading is true', () => {
    renderTodoItem({ isLoading: true });
    
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(screen.getByText('Delete')).toBeDisabled();
  });

  it('shows completed style when todo is completed', () => {
    renderTodoItem({ todo: { ...mockTodo, status: true } });
    
    const todoItem = screen.getByRole('listitem');
    expect(todoItem).toHaveClass('todo-item--completed');
  });

  it('shows recurrence label when todo has recurrence', () => {
    renderTodoItem({ 
      todo: { 
        ...mockTodo, 
        recurrence: Recurrence.DAILY 
      } 
    });
    
    expect(screen.getByText('• Daily')).toBeInTheDocument();
  });

  it('shows dependencies when todo has dependencies', () => {
    const todoWithDeps = {
      ...mockTodo,
      dependencies: [
        { 
          id: '2', 
          title: 'Dependency 1',
          status: false,
          priority: Priority.LOW,
          recurrence: Recurrence.NONE,
          nextOccurrence: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dependencies: []
        },
        { 
          id: '3', 
          title: 'Dependency 2',
          status: false,
          priority: Priority.LOW,
          recurrence: Recurrence.NONE,
          nextOccurrence: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dependencies: []
        }
      ]
    };
    
    renderTodoItem({ todo: todoWithDeps });
    
    expect(screen.getByText('Waiting on:')).toBeInTheDocument();
    expect(screen.getByText('Dependency 1, Dependency 2')).toBeInTheDocument();
  });
}); 