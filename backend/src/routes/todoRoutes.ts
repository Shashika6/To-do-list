import { Router } from 'express';
import { Todo, Priority, Recurrence } from '../models/Todo';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { sortBy, priority, status } = req.query;
    let query = Todo.find();

    if (priority) {
      query = query.where('priority').equals(priority);
    }
    if (status) {
      query = query.where('status').equals(status === 'true');
    }

    switch (sortBy) {
      case 'priority':
        query = query.sort({ priority: 1 });
        break;
      case 'status':
        query = query.sort({ status: 1 });
        break;
      case 'date':
        query = query.sort({ createdAt: -1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
    }

    const todos = await query.populate('dependencies');
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, priority, recurrence, dependencies } = req.body;
    
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }

    const newTodo = await Todo.create({
      title: title.trim(),
      priority: priority || Priority.MEDIUM,
      recurrence: recurrence || Recurrence.NONE,
      dependencies: dependencies || [],
      nextOccurrence: new Date()
    });

    await newTodo.populate('dependencies');
    res.status(201).json(newTodo);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, priority, recurrence, dependencies } = req.body;
    
    const todo = await Todo.findById(id).populate('dependencies');
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (status === true && !todo.canComplete) {
      return res.status(400).json({ 
        error: 'Cannot complete task: dependencies are not completed',
        incompleteDependencies: todo.dependencies.filter((dep: any) => !dep.status)
      });
    }

    if (status === false) {
      const dependentTodos = await Todo.find({ 
        dependencies: id,
        status: true 
      }).populate('dependencies');
      
      if (dependentTodos.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot mark task as incomplete: it is a completed dependency for other tasks',
          dependentTasks: dependentTodos.map(todo => todo.title)
        });
      }
    }
    
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      todo.title = title.trim();
    }
    
    if (status !== undefined) {
      todo.status = status;
    }

    if (priority !== undefined) {
      todo.priority = priority;
    }

    if (recurrence !== undefined) {
      todo.recurrence = recurrence;

      if (recurrence !== Recurrence.NONE) {
        const nextDate = new Date();
        switch (recurrence) {
          case Recurrence.DAILY:
            nextDate.setDate(nextDate.getDate() + 1);
            break;
          case Recurrence.WEEKLY:
            nextDate.setDate(nextDate.getDate() + 7);
            break;
          case Recurrence.MONTHLY:
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        }
        todo.nextOccurrence = nextDate;
      }
    }

    if (dependencies !== undefined) {
      todo.dependencies = dependencies;
    }
    
    await todo.save();
    await todo.populate('dependencies');
    res.json(todo);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const dependentTodos = await Todo.find({ dependencies: id });
    if (dependentTodos.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete task: it is a dependency for other tasks' 
      });
    }

    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, priority, status } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    let query = Todo.find({
      title: { $regex: q as string, $options: 'i' }
    });

    if (priority) {
      query = query.where('priority').equals(priority);
    }
    if (status) {
      query = query.where('status').equals(status === 'true');
    }

    const { sortBy } = req.query;
    switch (sortBy) {
      case 'priority':
        query = query.sort({ priority: 1 });
        break;
      case 'status':
        query = query.sort({ status: 1 });
        break;
      case 'date':
        query = query.sort({ createdAt: -1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
    }
    
    const todos = await query.populate('dependencies');
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

export default router; 