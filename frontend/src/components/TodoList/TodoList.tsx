import React from 'react';

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
          <span>{todo.task}</span>
          <button onClick={() => onEdit(todo.id, todo.task)}>Edit</button>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
