import { Priority, Todo } from "../services/api";
import CustomSelect from "./CustomSelect";
import { Recurrence } from '../services/api';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  updateTodoPriority: (id: string, priority: Priority) => void;
  deleteTodo: (id: string) => void;
  isLoading: boolean;
}

const getRecurrenceLabel = (recurrence: Recurrence) => {
  switch (recurrence) {
    case Recurrence.TEN_SECONDS:
      return 'Every 10s';
    case Recurrence.DAILY:
      return 'Daily';
    case Recurrence.WEEKLY:
      return 'Weekly';
    case Recurrence.MONTHLY:
      return 'Monthly';
    default:
      return '';
  }
};

const TodoItem = ({ todo, toggleTodo, updateTodoPriority, deleteTodo, isLoading }: TodoItemProps) => {
  return (
    <li
      key={todo.id}
      className={`todo-item ${todo.status ? "todo-item--completed" : ""}`}
    >
      <div className="todo-item__timestamp">
        <span className="todo-item__timestamp-label">Created:</span>
        <div className="todo-meta">
          <span className="todo-timestamp">
            {new Date(todo.createdAt).toLocaleString()}
            {todo.recurrence && todo.recurrence !== Recurrence.NONE && (
              <span className="recurrence-label">
                {' • '}{getRecurrenceLabel(todo.recurrence)}
              </span>
            )}
          </span>
        </div>
      </div>
      <div className="todo-item__content">
        <input
          type="checkbox"
          className="todo-item__checkbox"
          checked={todo.status}
          onChange={() => toggleTodo(todo.id)}
          disabled={isLoading}
        />
        <div
          className={`todo-item__title ${
            todo.status ? "todo-item__title--completed" : ""
          }`}
        >
          <span>{todo.title}</span>
        </div>
        <div className="todo-item__priority">
          <span
            className={`todo-item__priority-tag todo-item__priority-tag--${todo.priority.toLowerCase()}`}
          >
            {todo.priority}
          </span>
        </div>
        {todo.dependencies.length > 0 && (
          <div className="todo-item__meta">
            <span className="todo-item__dependencies">
              <span>Waiting on: </span>
              {todo.dependencies.map((dep) => dep.title).join(", ")}
            </span>
          </div>
        )}
      </div>
      <div className="todo-item__actions">
        <CustomSelect
          value={todo.priority}
          onChange={(value) => updateTodoPriority(todo.id, value as Priority)}
          options={Object.values(Priority).map((priority) => ({
            value: priority,
            label: priority,
          }))}
          disabled={isLoading}
        />
        <button
          className="todo-item__delete"
          onClick={() => deleteTodo(todo.id)}
          disabled={isLoading}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TodoItem; 