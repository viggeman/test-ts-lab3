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
      { id: 1, task: 'Task 1', completed: false },
      { id: 2, task: 'Task 2', completed: true },
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
    cy.get('li[data-testid="todo-item"]').should('have.length', 2);
  });
});
