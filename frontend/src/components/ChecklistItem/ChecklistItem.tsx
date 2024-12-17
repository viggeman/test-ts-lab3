import { ChangeEvent, FC, useState } from 'react';
import styles from './ChecklistItem.module.css';

interface Checklist {
  id: number;
  item: string;
  checked: boolean;
}

interface ChecklistItemProps {
  todoId: number;
  item: Checklist;
  onDelete: (id: number) => void;
}

const ChecklistItem: FC<ChecklistItemProps> = ({ todoId, item, onDelete }) => {
  const [checklistItem, setChecklistItem] = useState<Checklist>(item);
  const [editing, setEditing] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<string>(item.item);

  const handleToggle = async () => {
    try {
      const response = await fetch(
        `/api/todos/${todoId}/checklist/${item.id}/toggle`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        setChecklistItem((prev) => ({ ...prev, checked: !prev.checked }));
      } else {
        console.error('Failed to toggle checklist item');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItem(e.target.value);
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(
        `/api/todos/${todoId}/checklist/${item.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            item: newItem,
            checked: checklistItem.checked,
          }),
        }
      );

      if (response.ok) {
        setChecklistItem((prev) => ({ ...prev, item: newItem }));
      } else {
        console.error('Failed to edit checklist item');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/todos/${todoId}/checklist/${item.id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        onDelete(item.id);
      } else {
        console.error('Failed to delete checklist item');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="checklistItem"
      key={checklistItem.id}
      style={{
        textDecoration: checklistItem.checked ? 'line-through' : 'none',
        color: checklistItem.checked ? '#aaa' : 'inherit',
      }}
    >
      <input
        type="checkbox"
        checked={checklistItem.checked}
        onChange={handleToggle}
        className={styles.checklistItemCheckbox}
      />
      {editing ? (
        <>
          <input
            type="text"
            value={newItem}
            onChange={handleEditChange}
            onBlur={handleEditSave}
            className={styles.checklistItemInput}
          />
          <button
            onClick={handleDelete}
            className={styles.checklistItemDeleteButton}
          >
            Delete
          </button>
        </>
      ) : (
        <span
          onClick={() => setEditing(true)}
          className={styles.checklistItemText}
        >
          {checklistItem.item}
        </span>
      )}
    </div>
  );
};

export default ChecklistItem;
