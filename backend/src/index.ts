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
      COALESCE(json_agg(json_build_object('id', ci.id, 'item', ci.item, 'checked', ci.checked)) FILTER (WHERE ci.item IS NOT NULL), '[]') AS checklist
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
  const { task, completed, description } = request.body;
  console.log(request.params);
  try {
    const { rows } = await client.query(
      'UPDATE todos SET task = $1, completed = $2, description = $3 WHERE id = $4 RETURNING *;',
      [task, completed, description, id]
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

app.post(
  '/api/todos/:id/checklist',
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const { item, checked } = request.body;
    try {
      const { rows } = await client.query(
        'INSERT INTO checklist_items (todo_id, item, checked) VALUES ($1, $2, $3) RETURNING *;',
        [id, item, checked]
      );
      response.status(201).send(rows[0]);
    } catch (error) {
      console.error('Error executing query', error);
      response.status(500).send('Internal Server Error');
    }
  }
);

app.put(
  '/api/todos/:id/checklist/:itemId',
  async (request: Request, response: Response) => {
    const { id, itemId } = request.params;
    const { item, checked } = request.body;
    try {
      const { rows } = await client.query(
        'UPDATE checklist_items SET item = $1, checked = $2 WHERE todo_id = $3 AND id = $4 RETURNING *;',
        [item, checked, id, itemId]
      );
      if (rows.length === 0) {
        response.status(404).send('Checklist item not found');
      } else {
        response.status(200).send(rows[0]);
      }
    } catch (error) {
      console.error('Error executing query', error);
      response.status(500).send('Internal Server Error');
    }
  }
);

app.delete(
  '/api/todos/:id/checklist/:itemId',
  async (request: Request, response: Response) => {
    const { id, itemId } = request.params;
    try {
      const { rowCount } = await client.query(
        'DELETE FROM checklist_items WHERE todo_id = $1 AND id = $2;',
        [id, itemId]
      );
      if (rowCount === 0) {
        response.status(404).send('Checklist item not found');
      } else {
        response.status(204).send();
      }
    } catch (error) {
      console.error('Error executing query', error);
      response.status(500).send('Internal Server Error');
    }
  }
);

app.patch(
  '/api/todos/:id/checklist/:itemId/toggle',
  async (request: Request, response: Response) => {
    const { id, itemId } = request.params;
    try {
      const { rows } = await client.query(
        'UPDATE checklist_items SET checked = NOT checked WHERE todo_id = $1 AND id = $2 RETURNING *;',
        [id, itemId]
      );
      if (rows.length === 0) {
        response.status(404).send('Checklist item not found');
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
