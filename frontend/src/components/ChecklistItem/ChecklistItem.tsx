import { FC, useState } from 'react';

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
  const [checklistItem, setChecklistItem] = useState(item);
  const [editing, setEditing] = useState(false);
  const [newItem, setNewItem] = useState(item.item);

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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div key={checklistItem.id}>
      <input
        type="checkbox"
        checked={checklistItem.checked}
        onChange={handleToggle}
      />
      {editing ? (
        <>
          <input
            type="text"
            value={newItem}
            onChange={handleEditChange}
            onBlur={handleEditSave}
          />
          <button onClick={handleDelete}>Delete</button>
        </>
      ) : (
        <span onClick={() => setEditing(true)}>{checklistItem.item}</span>
      )}
    </div>
  );
};

export default ChecklistItem;
