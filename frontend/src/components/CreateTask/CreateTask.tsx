import { FC, FormEvent, useState } from 'react';
import styles from './CreateTask.module.css';

interface CreateTaskProps {
  onCreateTask: (task: string) => void;
}

const CreateTask: FC<CreateTaskProps> = ({ onCreateTask }) => {
  const [task, setTask] = useState<string>('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onCreateTask(task);
    setTask('');
  };

  return (
    <div className={styles.createTaskContainer}>
      <form onSubmit={handleSubmit} className={styles.createTaskForm}>
        <input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          data-testid="task-input"
          className={styles.taskInput}
        />
        <button type="submit" className={styles.createButton}>
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
