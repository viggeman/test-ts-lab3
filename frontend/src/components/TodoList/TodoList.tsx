import React, { useState } from 'react';

interface Checklist {
  item: string;
  checked: boolean;
}

interface Todo {
  id: number;
  task: string;
  completed: boolean;
  description: string;
  checklist: Checklist[];
}

interface TodoListProps {
  todos: Todo[];
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
  console.log('data', todos);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleOpenModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTodo(null);
  };

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
    <div>
      {todos.map((todo) => (
        <div
          key={todo.id}
          data-testid="todo-item"
          onClick={() => handleOpenModal(todo)}
        >
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
              <h3>{todo.task}</h3>
              <button onClick={() => handleEdit(todo.id, todo.task)}>
                Edit
              </button>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
      {showModal && selectedTodo && (
        <div className="modal" data-testid="todo-modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>{selectedTodo.task}</h2>
            <p>{selectedTodo.description}</p>
            <div>
              {selectedTodo.checklist.map((listItem, index) => (
                <div key={index}>
                  <input type="checkbox" checked={listItem.checked} readOnly />
                  <span>{listItem.item}</span>
                </div>
              ))}
            </div>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
