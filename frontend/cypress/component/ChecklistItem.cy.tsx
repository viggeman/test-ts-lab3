import { mount } from '@cypress/react';
import React from 'react';
import ChecklistItem from '../../src/components/ChecklistItem/ChecklistItem';

describe('ChecklistItem Component', () => {
  const mockTodoId = 1;
  const mockItem = { id: 1, item: 'Test item', checked: false };

  it('toggles the checked state', () => {
    cy.intercept(
      'PATCH',
      `/api/todos/${mockTodoId}/checklist/${mockItem.id}/toggle`,
      {
        statusCode: 200,
        body: { ...mockItem, checked: true },
      }
    ).as('toggleRequest');

    mount(
      <ChecklistItem todoId={mockTodoId} item={mockItem} onDelete={() => {}} />
    );

    cy.get('input[type="checkbox"]').click();
    cy.wait('@toggleRequest');
    cy.get('input[type="checkbox"]').should('be.checked');
  });

  it('edits the checklist item', () => {
    cy.intercept('PUT', `/api/todos/${mockTodoId}/checklist/${mockItem.id}`, {
      statusCode: 200,
      body: { ...mockItem, item: 'Edited item' },
    }).as('editRequest');

    mount(
      <ChecklistItem todoId={mockTodoId} item={mockItem} onDelete={() => {}} />
    );

    cy.contains(mockItem.item).click();
    cy.get('input[type="text"]').type('Edited item').blur();
    cy.wait('@editRequest');
    cy.contains('Edited item').should('be.visible');
  });

  it('deletes the checklist item', () => {
    const mockOnDelete = cy.spy();

    cy.intercept(
      'DELETE',
      `/api/todos/${mockTodoId}/checklist/${mockItem.id}`,
      {
        statusCode: 200,
      }
    ).as('deleteRequest');

    mount(
      <ChecklistItem
        todoId={mockTodoId}
        item={mockItem}
        onDelete={mockOnDelete}
      />
    );

    cy.contains(mockItem.item).click();
    cy.contains('Delete').click();
    cy.wait('@deleteRequest');
    cy.wrap(mockOnDelete).should('have.been.calledWith', mockItem.id);
  });
});
