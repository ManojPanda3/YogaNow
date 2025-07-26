import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process?.env?.BASE_URL ?? "http://localhost:3000",
    setupNodeEvents(on, config) {
    },
  },
});
