/// <reference types="cypress" />

describe('Todo App E2E', () => {
  it('fetches and displays todos', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos');
    cy.wait('@getTodos');
    cy.get('h3').should('have.length', 2);
  });

  it('creates a new todo', () => {
    cy.visit('/');
    const newTask = 'New Task';
    cy.intercept('POST', '/api/todos', {
      statusCode: 201,
      body: {
        id: 3,
        task: newTask,
        completed: false,
        description: '',
        checklist: [],
      },
    }).as('createTodo');

    cy.get('input[placeholder="Enter task"]').type(newTask);
    cy.contains('Create').click();
    cy.wait('@createTodo');
    cy.contains(newTask).should('be.visible');
  });

  it('updates an existing todo', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos');
    cy.wait('@getTodos');

    cy.intercept('PUT', '/api/todos/1', {
      statusCode: 200,
      body: {
        id: 1,
        task: 'Edited Task',
        completed: false,
        description: 'Edited Description',
        checklist: [],
      },
    }).as('editTodo');

    cy.get('h3').first().click();
    cy.get('[data-testid="todo-modal"]').contains('Edit').click();
    cy.get('input[type="text"]').clear().type('Edited Task');
    cy.get('textarea').clear().type('Edited Description');
    cy.get('[data-testid="todo-modal"]').contains('Save').click();
    cy.wait('@editTodo');
    cy.contains('Edited Task').should('be.visible');
  });

  it('deletes a todo', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos');
    cy.wait('@getTodos');

    cy.intercept('DELETE', '/api/todos/1', { statusCode: 204 }).as(
      'deleteTodo'
    );

    cy.get('h3').first().click();
    cy.get('[data-testid="todo-modal"]').contains('Delete').click();
    cy.wait('@deleteTodo');
    cy.contains('Task 1').should('not.exist');
  });

  it('toggles a todo as complete', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos');
    cy.wait('@getTodos');

    cy.intercept('PATCH', '/api/todos/1/toggle', {
      statusCode: 200,
      body: {
        id: 1,
        task: 'Task 1',
        completed: true,
        description: 'Description 1',
        checklist: [],
      },
    }).as('toggleTodo');

    cy.get('input[type="checkbox"]').first().click();
    cy.wait('@toggleTodo');
    // Add assertions for visual feedback
  });

  it('adds a new checklist item', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos');
    cy.wait('@getTodos');

    cy.intercept('POST', '/api/todos/1/checklist', {
      statusCode: 201,
      body: { id: 3, item: 'New checklist item', checked: false },
    }).as('addChecklistItem');

    cy.get('h3').first().click();
    cy.get('[data-testid="todo-modal"]').should('be.visible');
    cy.get('input[placeholder="Add checklist item"]').type(
      'New checklist item'
    );
    cy.get('[data-testid="todo-modal"]').contains('Add Item').click();
    cy.wait('@addChecklistItem');
    cy.contains('New checklist item').should('be.visible');
  });

  it('updates an existing checklist item', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos');
    cy.wait('@getTodos');

    cy.intercept('PUT', '/api/todos/1/checklist/1', {
      statusCode: 200,
      body: { id: 1, item: 'Edited checklist item', checked: false },
    }).as('editChecklistItem');

    cy.get('h3').first().click();
    cy.get('[data-testid="todo-modal"]').should('be.visible');
    cy.contains('Checklist item 1').click(); // Click to edit
    cy.get('input[type="text"]').clear().type('Edited checklist item').blur();
    cy.wait('@editChecklistItem');
    cy.contains('Edited checklist item').should('be.visible');
  });

  it('deletes a checklist item', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos');
    cy.wait('@getTodos');

    cy.intercept('DELETE', '/api/todos/1/checklist/1', { statusCode: 204 }).as(
      'deleteChecklistItem'
    );

    cy.get('h3').first().click();
    cy.get('[data-testid="todo-modal"]').should('be.visible');
    cy.contains('Checklist item 1').click(); // Click to edit
    cy.contains('Delete').click();
    cy.wait('@deleteChecklistItem');
    cy.contains('Checklist item 1').should('not.exist');
  });

  it('toggles a checklist item', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos');
    cy.wait('@getTodos');

    cy.intercept('PATCH', '/api/todos/1/checklist/1/toggle', {
      statusCode: 200,
      body: { id: 1, item: 'Checklist item 1', checked: true },
    }).as('toggleChecklistItem');

    cy.get('h3').first().click();
    cy.get('[data-testid="todo-modal"]').should('be.visible');
    cy.get('input[type="checkbox"]').eq(1).click();
    cy.wait('@toggleChecklistItem');
  });
});
