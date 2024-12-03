import { FC, useEffect } from 'react';
import './App.css';

const App: FC = () => {
  const getTodos = async () => {
    try {
      const response = await fetch('api/todos');
      const data = await response.json();
      console.log('data', data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div>
      <h1>App</h1>
    </div>
  );
};

export default App;
