import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    component: {
      devServer: {
        framework: 'react',
        bundler: 'vite',
      },
    },
    supportFile: false,
  },

  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
  },
});
