import { FC, useEffect, useState } from 'react';
import './App.css';
import TodoList from './components/TodoList/TodoList';

interface todos {
  id: number;
  task: string;
  completed: boolean;
}

const App: FC = () => {
  const [todos, setTodos] = useState<Array<todos>>([]);
  const getTodos = async () => {
    try {
      const response = await fetch('api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div>
      {todos.map((todo) => (
        <TodoList todo={todo} />
        // <div key={todo.id}>
        //   <p>{todo.task}</p>
        //   <p>{todo.id}</p>
        // </div>
      ))}
    </div>
  );
};

export default App;
