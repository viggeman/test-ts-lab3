import { FC } from 'react';

interface CreateTaskProps {
  onCreateTask: (task: string) => void;
}

const CreateTask: FC<CreateTaskProps> = ({ onCreateTask }) => {
  return (
    <form>
      <input type="text" data-testid="task-input" />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateTask;
