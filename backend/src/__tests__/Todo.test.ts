import mongoose from 'mongoose';
import { Todo, Priority, Recurrence } from '../models/Todo';

// Mock mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(),
    connection: {
      close: jest.fn()
    },
    model: jest.fn().mockReturnValue({
      create: jest.fn(),
      findById: jest.fn(),
      deleteMany: jest.fn(),
      populate: jest.fn().mockReturnThis()
    })
  };
});

describe('Todo Model', () => {
  let mockTodo: any;
  let mockDependency: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTodo = {
      _id: '123',
      title: 'Test Todo',
      priority: Priority.MEDIUM,
      recurrence: Recurrence.NONE,
      status: false,
      dependencies: [],
      canComplete: true
    };

    mockDependency = {
      _id: '456',
      title: 'Dependency Todo',
      priority: Priority.MEDIUM,
      recurrence: Recurrence.NONE,
      status: false
    };

    // Mock the Todo model methods
    (Todo.create as jest.Mock).mockImplementation((data) => Promise.resolve({
      ...data,
      _id: '123',
      canComplete: !data.dependencies || data.dependencies.every((dep: any) => dep.status === true)
    }));

    (Todo.findById as jest.Mock).mockImplementation((id) => Promise.resolve(mockTodo));
  });

  describe('canComplete virtual property', () => {
    it('should return true when there are no dependencies', async () => {
      const todo = await Todo.create({
        title: 'Test Todo',
        priority: Priority.MEDIUM,
        recurrence: Recurrence.NONE,
      });

      expect(todo.canComplete).toBe(true);
    });

    it('should return true when all dependencies are completed', async () => {
      const completedDependency = {
        ...mockDependency,
        status: true
      };

      const todo = await Todo.create({
        title: 'Test Todo',
        priority: Priority.MEDIUM,
        recurrence: Recurrence.NONE,
        dependencies: [completedDependency]
      });

      expect(todo.canComplete).toBe(true);
    });

    it('should return false when any dependency is not completed', async () => {
      const todo = await Todo.create({
        title: 'Test Todo',
        priority: Priority.MEDIUM,
        recurrence: Recurrence.NONE,
        dependencies: [mockDependency] // status is false by default
      });

      expect(todo.canComplete).toBe(false);
    });
  });
}); 