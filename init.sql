DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

INSERT INTO todos (task, completed) VALUES
('Buy korv', false),
('Walk the floor', false),
('Read a bible', true);
