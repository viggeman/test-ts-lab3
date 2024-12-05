import React, { useState } from 'react';

interface TodoListProps {
  todos: { id: number; task: string; completed: boolean }[];
  onToggleComplete: (id: number) => void;
  onEdit: (id: number, newTask: string) => void;
  onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  onToggleComplete,
  onEdit,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<string>('');

  const handleEdit = async (id: number, task: string) => {
    setEditingId(id);
    setNewTask(task);
  };
  const handleSave = async (id: number) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: newTask, completed: todo.completed }),
      });

      if (response.ok) {
        onEdit(id, newTask);
        setEditingId(null);
        setNewTask('');
      } else {
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(id);
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (todos.length === 0) {
    return <div>No todos yet!</div>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} data-testid="todo-item">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id)}
          />
          {editingId === todo.id ? (
            <>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button onClick={() => handleSave(todo.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <span>{todo.task}</span>
              <button onClick={() => handleEdit(todo.id, todo.task)}>
                Edit
              </button>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
