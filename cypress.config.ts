import { defineConfig } from "cypress";
import plugin from "cypress-localstorage-commands/plugin";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    port: 4242,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      
      plugin(on, config);
      return config;
    },
  },
});
