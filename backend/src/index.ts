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
  try {
    const result = await client.query(`
      SELECT
        t.*,
      COALESCE(json_agg(json_build_object('item', ci.item, 'checked', ci.checked)) FILTER (WHERE ci.item IS NOT NULL), '[]') AS checklist
      FROM
        todos t
      LEFT JOIN
        checklist_items ci ON t.id = ci.todo_id
      GROUP BY
        t.id, t.task, t.description, t.completed
      ORDER BY t.created_at DESC
    `);
    const todos = result.rows;
    response.json(todos);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Failed to get todos' });
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

app.patch(
  '/api/todos/:id/toggle',
  async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
      const { rows } = await client.query(
        'UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *;',
        [id]
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
  }
);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
