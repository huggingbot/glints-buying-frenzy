module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['jest-extended/all'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: './tsconfig.json',
    },
  },
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/$1',
  },
  moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src'],
  transform: {
    '^.+\\.[t|j]s$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['db_scripts', 'swagger'],
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.mts', '!src/**/*.d.ts', '!src/**/*.d.mts'],
}
