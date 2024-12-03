import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { Client } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

app.use(express.json());

app.get('/api/todos', async (_request: Request, response: Response) => {
  const { rows } = await client.query('SELECT * FROM todos;');
  try {
    response.status(200).send(rows);
  } catch (error) {
    console.error('Error executing query', error);
  }
});

app.post('/api/todos', async (request: Request, response: Response) => {
  const { task, completed } = request.body;
  console.log('post', task, completed);
  try {
    const { rows } = await client.query(
      'INSERT INTO todos (task, completed) VALUES ($1, $2) RETURNING *;',
      [task, completed]
    );
    response.status(201).send(rows[0]);
  } catch (error) {
    console.error('Error executing query', error);
    response.status(500).send('Internal Server Error');
  }
});

app.put('/api/todos/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const { task, completed } = request.body;
  try {
    const { rows } = await client.query(
      'UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *;',
      [task, completed, id]
    );
    if (rows.length === 0) {
      response.status(404).send('Todo not found');
    } else {
      response.status(200).send(rows[0]);
    }
  } catch (error) {
    console.error('Error executing query', error);
    response.status(500).send('Internal Server Error');
  }
});

app.delete('/api/todos/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const { rowCount } = await client.query(
      'DELETE FROM todos WHERE id = $1;',
      [id]
    );
    if (rowCount === 0) {
      response.status(404).send('Todo not found');
    } else {
      response.status(204).send();
    }
  } catch (error) {
    console.error('Error executing query', error);
    response.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
