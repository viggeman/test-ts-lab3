import React, { useState } from 'react';
import styles from './TodoList.module.css';

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

  const handleEdit = (id: number, task: string) => {
    setEditingId(id);
    setNewTask(task);
  };

  const handleSave = (id: number) => {
    onEdit(id, newTask);
    setEditingId(null);
    setNewTask('');
    if (selectedTodo) {
      setSelectedTodo({ ...selectedTodo, task: newTask });
    }
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    setEditingId(null);
    setShowModal(!showModal);
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
          <h3>{todo.task}</h3>
        </div>
      ))}
      {showModal && selectedTodo && (
        <div className={styles.modal} data-testid="todo-modal">
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={handleCloseModal}>
              &times;
            </span>
            <div>
              {editingId === selectedTodo.id ? (
                <>
                  <div className={styles.editContainer}>
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                    />
                    <textarea
                      value={selectedTodo.description}
                      onChange={(e) =>
                        setSelectedTodo({
                          ...selectedTodo,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className={styles.buttonContainer}>
                      <div>
                        <button onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                        <button onClick={() => handleSave(selectedTodo.id)}>
                          Save
                        </button>
                      </div>
                      <div>
                        <button onClick={() => handleDelete(selectedTodo.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2>{selectedTodo.task}</h2>
                  <p>{selectedTodo.description}</p>
                  <div>
                    {selectedTodo.checklist.map((listItem, index) => (
                      <div key={index}>
                        <input
                          type="checkbox"
                          checked={listItem.checked}
                          readOnly
                        />
                        <span>{listItem.item}</span>
                      </div>
                    ))}
                  </div>
                  <span
                    onClick={() =>
                      handleEdit(selectedTodo.id, selectedTodo.task)
                    }
                  >
                    Edit
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
