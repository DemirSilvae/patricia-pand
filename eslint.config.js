// eslint.config.js
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginTS from '@typescript-eslint/eslint-plugin'
import parserTS from '@typescript-eslint/parser'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginESLintComments from 'eslint-plugin-eslint-comments'

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.turbo/**',
      'coverage/**',
      'src/grindurus-frontend/src/typechain-types/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserTS,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTS,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      import: eslintPluginImport,
      'jsx-a11y': eslintPluginJsxA11y,
      prettier: eslintPluginPrettier,
      'simple-import-sort': pluginSimpleImportSort,
      'eslint-comments': pluginESLintComments,
    },
    rules: {
      semi: ['error', 'never'],
      "@typescript-eslint/semi": "off",
      'prettier/prettier': ['error', { semi: false }],
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
