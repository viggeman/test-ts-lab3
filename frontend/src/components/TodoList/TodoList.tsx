import { FC } from 'react';
// import styles from './TodoList.module.scss';

interface todo {
  id: number;
  task: string;
  completed: boolean;
}

interface Props {
  todo: todo;
}

const TodoList: FC<Props> = ({ todo }) => {
  const { id, task, completed } = todo;
  return (
    <div>
      <p>{completed}</p>
      <p>{task}</p>
      <p>{id}</p>
    </div>
  );
};

export default TodoList;
