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

INSERT INTO todos (task, description, completed) VALUES
('Buy Groceries', 'Buy some sausages', false),
('Walk the floor', 'Walk around the house', false),
('Read a bible', 'Read a religious book', true);

INSERT INTO checklist_items (todo_id, item, checked) VALUES
(1, 'Buy bread', false),
(1, 'Buy mustard', false),
(2, 'Walk to the park', false),
(2, 'Walk back home', false),
(3, 'Read Again', true),
(3, 'Read It Again', false);
