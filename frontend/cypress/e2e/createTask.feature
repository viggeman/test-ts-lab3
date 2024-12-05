Feature: Create a new task

  Scenario: User can create a new task
    Given the user is on the create task page
    When the user types "Buy Palle Kuling" into the task input field
    And the user clicks the "Create" button
    Then the task "Buy Palle Kuling" should be created
    And the task "Buy Palle Kuling" should appear in the todo list
