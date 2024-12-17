import React, { useState } from 'react';
import ChecklistItem from '../ChecklistItem/ChecklistItem';
import styles from './TodoList.module.css';

interface Checklist {
  id: number;
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
  onEdit: (id: number, newTask: string, newDescription: string) => void;
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
  const [newDescription, setNewDescription] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [checklistItems, setChecklistItems] = useState<Checklist[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState<string>('');

  const handleOpenModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
    setChecklistItems(todo.checklist);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTodo(null);
    setChecklistItems([]);
  };

  const addChecklistItem = async () => {
    try {
      if (newChecklistItem.trim() !== '' && selectedTodo) {
        const response = await fetch(
          `/api/todos/${selectedTodo.id}/checklist`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              item: newChecklistItem.trim(),
              checked: false,
            }),
          }
        );

        if (response.ok) {
          const newItem: Checklist = await response.json();
          setChecklistItems((prevItems) => [...prevItems, newItem]);
          setNewChecklistItem('');
        } else {
          console.error('Failed to add checklist item');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id: number, task: string, description: string) => {
    setEditingId(id);
    setNewTask(task);
    setNewDescription(description);
  };

  const handleSave = (id: number) => {
    onEdit(id, newTask, newDescription);
    setEditingId(null);
    setNewTask('');
    setNewDescription('');
    if (selectedTodo) {
      setSelectedTodo({
        ...selectedTodo,
        task: newTask,
        description: newDescription,
      });
    }
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    setEditingId(null);
    setShowModal(false);
  };

  if (todos.length === 0) {
    return <div>No todos yet!</div>;
  }

  return (
    <div className={styles.todoListContainer}>
      {todos.map((todo) => (
        <div key={todo.id} data-testid="todo-item" className={styles.todoItem}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id)}
            className={styles.todoCheckbox}
          />
          <h3 className={styles.todoTask} onClick={() => handleOpenModal(todo)}>
            {todo.task}
          </h3>
        </div>
      ))}
      {showModal && selectedTodo && (
        <div className={styles.modal} data-testid="todo-modal">
          <div className={styles.modalContent}>
            <span
              className={styles.closeButton}
              data-testid="close-button"
              onClick={handleCloseModal}
            >
              &times;
            </span>
            <div className={styles.modalBody}>
              {editingId === selectedTodo.id ? (
                <>
                  <div className={styles.editContainer}>
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className={styles.editInput}
                    />
                    <textarea
                      value={newDescription || undefined}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className={styles.editTextarea}
                    />
                    <div className={styles.buttonContainer}>
                      <div>
                        <button
                          onClick={() => setEditingId(null)}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(selectedTodo.id)}
                          className={styles.saveButton}
                        >
                          Save
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => handleDelete(selectedTodo.id)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className={styles.todoTitle}>{selectedTodo.task}</h2>
                  <p className={styles.todoDescription}>
                    {selectedTodo.description}
                  </p>
                  <input
                    type="text"
                    placeholder="Add checklist item"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    className={styles.addItemInput}
                  />
                  <button
                    onClick={addChecklistItem}
                    className={styles.addItemButton}
                  >
                    Add Item
                  </button>
                  <div className={styles.checklistContainer}>
                    {checklistItems.map((listItem) => (
                      <ChecklistItem
                        key={listItem.id}
                        todoId={selectedTodo.id}
                        item={listItem}
                        onDelete={() =>
                          setChecklistItems(
                            checklistItems.filter(
                              (item) => item.id !== listItem.id
                            )
                          )
                        }
                      />
                    ))}
                  </div>
                  <span
                    onClick={() =>
                      handleEdit(
                        selectedTodo.id,
                        selectedTodo.task,
                        selectedTodo.description
                      )
                    }
                    className={styles.editLink}
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
