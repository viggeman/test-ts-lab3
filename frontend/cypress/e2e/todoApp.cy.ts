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
    cy.intercept('POST', '/api/todos').as('createTodo');

    cy.get('input[placeholder="Enter task"]').type(newTask);
    cy.contains('Create').click();
    cy.wait('@createTodo')
      .its('request.body')
      .should('deep.equal', { task: newTask, completed: false });

    cy.contains(newTask).should('be.visible');
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

  it('deletes a checklist item', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos');
    cy.wait('@getTodos');

    cy.intercept('DELETE', '/api/todos/1/checklist/1', { statusCode: 204 }).as(
      'deleteChecklistItem'
    );

    cy.get('h3').first().click();
    cy.get('[data-testid="todo-modal"]').should('be.visible');

    cy.contains('Checklist item 1').click();
    cy.contains('Delete').click();

    cy.wait('@deleteChecklistItem');
    cy.contains('Checklist item 1').should('not.exist');
  });
});
