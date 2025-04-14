import config from '@remcohaszing/eslint'

export default [
  ...config,
  { ignores: ['**/*.jsx'] },
  {
    rules: {
      '@typescript-eslint/naming-convention': 'off'
    }
  }
]
