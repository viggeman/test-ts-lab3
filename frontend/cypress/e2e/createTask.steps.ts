import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('the user is on the create task page', () => {
  cy.visit('/create');
});

When('the user types {string} into the task input field', (task) => {
  cy.get('[data-testid="task-input"]').type(task);
});

When('the user clicks the {string} button', (buttonName) => {
  cy.contains(buttonName).click();
});

Then('the task {string} should be created', (task) => {
  cy.wait('@createTaskRequest').its('request.body').should('deep.equal', {
    task: task,
    completed: false,
  });
});

Then('the task {string} should appear in the todo list', (task) => {
  cy.get('[data-testid="todo-list"]').contains(task).should('be.visible');
});
