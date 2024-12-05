import { FC, useEffect, useState } from 'react';
import './App.css';
import CreateTask from './components/CreateTask/CreateTask';
import TodoList from './components/TodoList/TodoList';

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const getTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleToggleComplete = async (id: number) => {
    try {
      const todo = todos.find((todo) => todo.id === id);
      if (!todo) {
        console.error('Todo not found');
        return;
      }

      const response = await fetch(`/api/todos/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (response.ok) {
        getTodos();
      } else {
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id: number, newTask: string) => {
    try {
      const todo = todos.find((todo) => todo.id === id);
      if (!todo) {
        console.error('Todo not found');
        return;
      }

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask, completed: todo.completed }),
      });

      if (response.ok) {
        getTodos();
      } else {
        console.error('Failed to edit todo');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        getTodos();
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (task: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, completed: false }),
      });

      if (response.ok) {
        getTodos();
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <CreateTask onCreateTask={handleCreateTask} />
      <TodoList
        todos={todos}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;
