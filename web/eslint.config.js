import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import testingLibrary from 'eslint-plugin-testing-library'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import tailwindRecommended from 'eslint-plugin-tailwindcss'

export default tseslint.config(
  { ignores: ['dist', '.storybook'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked
    ],
    files: ['**/*.{ts,tsx}'],
    settings: { react: { version: '19' } },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'prettier-recommended': prettierRecommended,
      tailwindcss: tailwindRecommended
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      // typescript
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { ignoreRestSiblings: true, argsIgnorePattern: '^_' }
      ],
      'react/prop-types': 'off',
      // READ-MORE: https://typescript-eslint.io/rules/consistent-type-definitions
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'warn',
      'tailwindcss/no-contradicting-classname': 'error',
      // typeAlias selectors should start with prefix T
      // READ-MORE: https://typescript-eslint.io/rules/naming-convention
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['typeAlias'],
          format: ['PascalCase'],
          custom: {
            regex: '^T[A-Z]',
            match: true
          }
        }
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE']
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase']
        },
        {
          selector: 'typeLike',
          format: ['PascalCase']
        }
      ]
    }
  },
  {
    files: [
      'src/**/*.{spec,test}.{js,jsx,ts,tsx}',
      'src/**/__tests__/**/*.{js,jsx,ts,tsx}'
    ],
    extends: [testingLibrary.configs['flat/react']],
    rules: {
      'testing-library/no-await-sync-events': [
        'error',
        {
          eventModules: ['fire-event']
        }
      ],
      'testing-library/no-manual-cleanup': 'error',
      'testing-library/prefer-explicit-assert': 'error',
      'testing-library/prefer-user-event': 'error',
      'testing-library/prefer-presence-queries': 'error'
    }
  },
  prettierRecommended,
  tailwindRecommended.configs['flat/recommended']
)
