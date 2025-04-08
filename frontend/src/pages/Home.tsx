import { useState, useEffect } from "react";
import TodoAPI, {
  Todo,
  Priority,
  Recurrence,
  CreateTodoDto,
} from "../services/api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchAndFilter from "../components/SearchAndFilter";
import AddTodoForm from "../components/AddTodoForm";
import TodoItem from "../components/TodoItem";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";

function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<CreateTodoDto>({
    title: "",
    priority: Priority.MEDIUM,
    recurrence: Recurrence.NONE,
    dependencies: [],
  });
  const [sortBy, setSortBy] = useState<string>("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority | "">("");
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSearchActive) {
      handleSearch();
    } else {
      fetchTodos();
    }
  }, [sortBy, selectedPriority, selectedStatus]);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const data = await TodoAPI.getAllTodos(
        sortBy,
        selectedPriority as Priority,
        selectedStatus as boolean
      );
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearchActive(false);
      fetchTodos();
      return;
    }
    setIsLoading(true);
    try {
      const data = await TodoAPI.searchTodos(
        searchQuery,
        sortBy,
        selectedPriority as Priority,
        selectedStatus as boolean
      );
      setTodos(data);
      setIsSearchActive(true);
    } catch (error) {
      console.error("Error searching todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    setIsLoading(true);
    try {
      const newTodoItem = await TodoAPI.createTodo(newTodo);
      setTodos([...todos, newTodoItem]);
      setNewTodo({
        title: "",
        priority: Priority.MEDIUM,
        recurrence: Recurrence.NONE,
        dependencies: [],
      });
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add task");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const updatedTodo = await TodoAPI.updateTodo(id, {
        status: !todo.status,
      });
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
      toast.success(
        `Task ${updatedTodo.status ? "completed" : "marked as incomplete"}!`
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast.error("Failed to update task status check for pending dependencies");
    } 
  };

  const updateTodoPriority = async (id: string, priority: Priority) => {
    try {
      const updatedTodo = await TodoAPI.updateTodo(id, { priority });
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (error) {
      console.error("Error updating todo priority:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await TodoAPI.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to delete task");
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchActive(false);
    fetchTodos();
  };

  return (
    <div className="home">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h1 className="home__title">Todo List</h1>

      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        isLoading={isLoading}
      />

      <AddTodoForm
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        addTodo={addTodo}
        todos={todos}
        isLoading={isLoading}
      />

      {isSearchActive && (
        <div className="search__results">
          <span className="search__results-text">
            `Results for ${searchQuery}`
          </span>
          <span className="search__clear" onClick={clearSearch}>
            Clear search
          </span>
        </div>
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <ul className="todo-list">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                updateTodoPriority={updateTodoPriority}
                deleteTodo={deleteTodo}
                isLoading={isLoading}
              />
            ))
          ) : (
            <EmptyState searchQuery={searchQuery} />
          )}
        </ul>
      )}
    </div>
  );
}

export default HomePage; 