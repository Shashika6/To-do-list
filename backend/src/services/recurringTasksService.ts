import { Todo, Recurrence } from '../models/Todo';

const checkRecurringTasks = async () => {
  try {
    const now = new Date();
    const completedRecurringTasks = await Todo.find({
      recurrence: { $ne: Recurrence.NONE },
      status: true,
      nextOccurrence: { $lte: now }
    });

    for (const task of completedRecurringTasks) {
      const existingPendingTask = await Todo.findOne({
        title: task.title,
        status: false,
        recurrence: task.recurrence
      });

      if (existingPendingTask) {
        continue;
      }

      const nextDate = new Date();
      switch (task.recurrence) {
        case Recurrence.TEN_SECONDS:
          nextDate.setSeconds(nextDate.getSeconds() + 10);
          break;
        case Recurrence.DAILY:
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case Recurrence.WEEKLY:
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case Recurrence.MONTHLY:
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        default:
          continue;
      }

      await Todo.create({
        title: task.title,
        priority: task.priority,
        recurrence: task.recurrence,
        dependencies: task.dependencies,
        nextOccurrence: nextDate
      });
    }
  } catch (error) {
    console.error('Error in recurring tasks:', error);
  }
};

const startRecurringTasks = () => {
  // Running every 10 seconds for testing purposes (Ideally it should be every hour)
  setInterval(checkRecurringTasks, 10 * 1000);
  
  checkRecurringTasks();
};

export { checkRecurringTasks, startRecurringTasks }; 