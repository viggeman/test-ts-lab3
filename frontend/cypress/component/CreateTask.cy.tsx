import { mount } from '@cypress/react';
import React from 'react';
import CreateTask from '../../src/components/CreateTask/CreateTask';

describe('CreateTask Component', () => {
  it('calls onCreateTask with the correct task when the form is submitted', () => {
    const mockOnCreateTask = cy.spy().as('createTask');

    mount(<CreateTask onCreateTask={mockOnCreateTask} />);

    cy.get('[data-testid="task-input"]').type('New task');
    cy.contains('Create').click();

    cy.get('@createTask').should('have.been.calledWith', 'New task');
  });
});
