DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checklist_items (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    checked BOOLEAN DEFAULT FALSE
);
