import { Priority, Recurrence, CreateTodoDto, Todo } from "../services/api";
import CustomSelect from "./CustomSelect";

interface AddTodoFormProps {
  newTodo: CreateTodoDto;
  setNewTodo: (todo: CreateTodoDto) => void;
  addTodo: () => void;
  todos: Todo[];
  isLoading: boolean;
}

const RECURRENCE_OPTIONS = [
  { value: "none", label: "No Recurrence" },
  { value: "10_seconds", label: "Every 10 Seconds" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const AddTodoForm = ({
  newTodo,
  setNewTodo,
  addTodo,
  todos,
  isLoading,
}: AddTodoFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTodo({ ...newTodo, [name]: value });
  };

  const handlePriorityChange = (value: string) => {
    setNewTodo({ ...newTodo, priority: value as Priority });
  };

  const handleRecurrenceChange = (value: string) => {
    setNewTodo({ ...newTodo, recurrence: value as Recurrence });
  };

  const handleDependencyChange = (value: string) => {
    if (value) {
      const currentDependencies = newTodo.dependencies || [];
      if (!currentDependencies.includes(value)) {
        setNewTodo({
          ...newTodo,
          dependencies: [...currentDependencies, value],
        });
      }
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__group">
        <label
          htmlFor="title"
          className="todo-form__label todo-form__label--required"
        >
          Task Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={newTodo.title}
          onChange={handleInputChange}
          className="todo-form__input"
          placeholder="Enter task title"
          required
          disabled={isLoading}
        />
      </div>

      <div className="todo-form__group">
        <label htmlFor="priority" className="todo-form__label">
          Priority
        </label>
        <CustomSelect
          value={newTodo.priority || ""}
          onChange={handlePriorityChange}
          options={Object.values(Priority).map((priority) => ({
            value: priority,
            label: priority,
          }))}
          disabled={isLoading}
        />
      </div>

      <div className="todo-form__group">
        <label htmlFor="recurrence" className="todo-form__label">
          Recurrence
        </label>
        <CustomSelect
          value={newTodo.recurrence || Recurrence.NONE}
          onChange={handleRecurrenceChange}
          options={RECURRENCE_OPTIONS}
          disabled={isLoading}
        />
      </div>

      <div className="todo-form__group">
        <label htmlFor="dependency" className="todo-form__label">
          Dependencies
        </label>
        <CustomSelect
          id="dependency"
          value=""
          onChange={handleDependencyChange}
          options={[
            { value: "", label: "Select a dependency" },
            ...todos
              .filter(
                (todo) =>
                  !(newTodo.dependencies || []).includes(todo.id) &&
                  !todo.status
              )
              .map((todo) => ({
                value: todo.id,
                label: todo.title,
              })),
          ]}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className="todo-form__button"
        disabled={!newTodo.title.trim() || isLoading}
      >
        Add Task
      </button>
      {(newTodo.dependencies || []).length > 0 && (
        <div className="selected-dependencies">
          {todos
            .filter((todo) => (newTodo.dependencies || []).includes(todo.id))
            .map((todo) => (
              <div key={todo.id} className="dependency-tag">
                <span>{todo.title}</span>
                <span
                  className="dependency-tag__remove"
                  role="button"
                  onClick={() => {
                    const newDependencies = (newTodo.dependencies || []).filter(
                      (id) => id !== todo.id
                    );
                    setNewTodo({ ...newTodo, dependencies: newDependencies });
                  }}
                >
                  ×
                </span>
              </div>
            ))}
        </div>
      )}
    </form>
  );
};

export default AddTodoForm;
