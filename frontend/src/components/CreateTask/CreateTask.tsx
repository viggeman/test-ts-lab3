import { FC, useState } from 'react';

interface CreateTaskProps {
  onCreateTask: (task: string) => void;
}

const CreateTask: FC<CreateTaskProps> = ({ onCreateTask }) => {
  const [task, setTask] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreateTask(task);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        data-testid="task-input"
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateTask;
