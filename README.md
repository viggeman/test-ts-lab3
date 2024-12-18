# Test-ts-lab3

## Project Summary

This project is a full-stack application that includes a frontend built with React, TypeScript, and Vite, and a backend built with Express and PostgreSQL. The main goal of this project is to create a Todo application where users can manage tasks and their associated checklist items.

### Achievements

- Implemented frontend using React and TypeScript.
- Created a backend API using Express and PostgreSQL.
- Integrated frontend and backend using RESTful APIs.
- Added Cypress tests for both component and end-to-end testing.
- Configured Docker for easy database management.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker
- Docker Compose

### Setup

1. Set up environment variables:

   - Create a `.env` file in the `backend` directory with the following content:

     ```env
     PGURI=postgresql://<username>:<password>@localhost:5433/<database>
     PORT=3000
     ```

   - Create a `.env.docker` file in the root directory with the following content:
     ```env
     POSTGRES_USER=<username>
     POSTGRES_PASSWORD=<password>
     POSTGRES_DB=<database>
     ```

### Running the Project

1. Start the PostgreSQL database using Docker Compose:

   ```sh
   docker-compose up -d
   ```

2. Start the backend server:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

3. Start the frontend development server:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to view the application.

### Running Tests

1. To run Cypress tests, use the following commands:

   ```sh
   cd frontend
   npm run cypress:open
   ```

   or to run tests in headless mode:

   ```sh
   npm run cypress:run
   ```

### Building the Project

1. To build the frontend for production:

   ```sh
   cd frontend
   npm run build
   ```

2. To build the backend:
   ```sh
   cd backend
   npm run build
   ```
