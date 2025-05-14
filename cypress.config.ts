import { defineConfig } from "cypress";
import plugin from "cypress-localstorage-commands/plugin";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    port: 4242,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser: Cypress.Browser, launchOptions) => {
        if (browser.name === "electron") {
          launchOptions.preferences.webPreferences.webSecurity = false;
          return launchOptions;
        }

        if (browser.name === "chrome" || browser.name === "chromium") {
          launchOptions.args.push("--disable-web-security");
          launchOptions.args.push("--allow-file-access-from-files");
          return launchOptions;
        }
      });

      plugin(on, config);
      return config;
    },
  },
});
