import js from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Global ignores to keep tooling away from generated artifacts
  {
    ignores: ['node_modules/**', 'services/**/generated/**', '**/generated/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ignores: [
      'node_modules/**',
      'services/user-service/generated/**', // ignore Prisma-generated files
      'services/**/generated/**',
      '**/generated/**',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'template-curly-spacing': 'warn',
      'arrow-spacing': 'warn',
      // Defer trailing comma formatting to Prettier to avoid circular fixes
      'comma-dangle': 'off',
      semi: ['warn', 'always'],
      quotes: ['warn', 'single', { avoidEscape: true }],
      // Defer indentation to Prettier to avoid conflicts
      indent: 'off',
      'max-len': ['warn', { code: 120, ignoreUrls: true }],
      camelcase: ['warn', { properties: 'never' }],
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'eol-last': 'warn',
      'no-trailing-spaces': 'warn',
      'no-empty': 'off',
    },
  },
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];
