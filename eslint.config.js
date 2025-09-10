import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: { js },
    extends: ["js/recommended", "plugin:prettier/recommended"],
    rules: {
      semi: ["error", "always"],
      "no-unused-vars": "warn",
      quotes: ["error", "single"]
    },
  },
]);
