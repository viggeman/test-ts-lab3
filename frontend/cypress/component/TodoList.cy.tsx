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
});
