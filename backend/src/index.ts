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

app.get('/api', async (_request: Request, response: Response) => {
  try {
    response.status(200).send('Hello from API');
  } catch (error) {
    console.error('Error executing query', error);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
