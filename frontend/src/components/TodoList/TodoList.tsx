import React from 'react';

interface TodoListProps {
  todos: { id: number; task: string; completed: boolean }[];
  onToggleComplete: (id: number) => void;
  onEdit: (id: number, newTask: string) => void;
  onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  if (todos.length === 0) {
    return <div>No todos yet!</div>;
  }

  return <ul></ul>; // Just an empty list for now
};

export default TodoList;
