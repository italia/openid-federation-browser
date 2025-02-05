import noSecrets from "eslint-plugin-no-secrets";
import react from "eslint-plugin-react";
import jsonc from "eslint-plugin-jsonc";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ),
  {
    plugins: {
      "no-secrets": noSecrets,
      react: react,
      jsonc: jsonc,
      prettier: prettier,
      "react-hooks": reactHooks,
      security: security,
    },

    settings: {
      react: {
        version: "18", // Automatically detect the react version
      },
    },

    rules: {
      "no-secrets/no-secrets": "error",
      ...reactHooks.configs.recommended.rules,
      ...security.configs.recommended.rules,
    },
  },
];
