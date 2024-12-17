import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // async setupNodeEvents(on, config) {
    //   const bundler = createBundler({
    //     plugins: [createEsbuildPlugin(config)],
    //   });

    //   on('file:preprocessor', bundler);
    //   await addCucumberPreprocessorPlugin(on, config);

    //   return config;
    // },
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
