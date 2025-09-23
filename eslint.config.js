import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import angularTemplateParser from "@angular-eslint/template-parser";
import angularTemplatePlugin from "@angular-eslint/eslint-plugin-template";

export default [
  {
    ignores: ["dist/**", "docs/**", "node_modules/**"],
  },

  // TypeScript files
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        window: "readonly",
        console: "readonly",
        // Jasmine test globals
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        expect: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // Angular HTML templates
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      "@angular-eslint/template": angularTemplatePlugin,
    },
    rules: {
      "@angular-eslint/template/no-negated-async": "warn",
      "@angular-eslint/template/banana-in-box": "error",
    },
  },
];
