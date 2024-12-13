import { mount } from '@cypress/react';
import TodoList from '../../src/components/TodoList/TodoList';

describe('TodoList Component', () => {
  it('renders "No todos yet!" when the list is empty', () => {
    mount(
      <TodoList
        todos={[]}
        onToggleComplete={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    cy.contains('No todos yet!').should('be.visible');
  });

  it('renders a list of todos', () => {
    const mockTodos = [
      {
        id: 1,
        task: 'Task 1',
        completed: false,
        description: 'Description 1',
        checklist: [],
      },
      {
        id: 2,
        task: 'Task 2',
        completed: true,
        description: 'Description 2',
        checklist: [],
      },
    ];
    mount(
      <TodoList
        todos={mockTodos}
        onToggleComplete={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    cy.contains('Task 1').should('be.visible');
    cy.contains('Task 2').should('be.visible');
    cy.get('div[data-testid="todo-item"]').should('have.length', 2);
  });

  it('calls onToggleComplete when checkbox is clicked', () => {
    const mockTodos = [
      {
        id: 1,
        task: 'Task 1',
        completed: false,
        description: 'Description 1',
        checklist: [],
      },
    ];
    const mockOnToggleComplete = cy.spy();

    mount(
      <TodoList
        todos={mockTodos}
        onToggleComplete={mockOnToggleComplete}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    cy.get('input[type="checkbox"]').click();
    cy.wrap(mockOnToggleComplete).should('have.been.calledWith', 1);
  });

  it('opens and displays the modal with the correct content', () => {
    const mockTodos = [
      {
        id: 1,
        task: 'Task 1',
        description: 'This is a test task',
        checklist: [],
        completed: false,
      },
    ];

    mount(
      <TodoList
        todos={mockTodos}
        onToggleComplete={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    cy.get('[data-testid="todo-item"]').click();
    cy.get('[data-testid="todo-modal"]').should('be.visible');
    cy.contains('Task 1').should('be.visible');
    cy.contains('This is a test task').should('be.visible');
    cy.get('[data-testid="todo-modal"]').contains('Edit').click();

    cy.get('input[type="text"]').should('have.value', 'Task 1');
    cy.get('textarea').should('have.value', 'This is a test task');

    cy.get('[data-testid="close-button"]').click();
    cy.get('[data-testid="todo-modal"]').should('not.exist');
  });
});
