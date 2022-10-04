export default {
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/jest.setup.js'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: './tsconfig.json',
    },
  },
  moduleNameMapper: {
    '~/src/(.*)': '<rootDir>/src/$1',
  },
  moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['db_scripts', 'swagger'],
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.mts', '!src/**/*.d.ts', '!src/**/*.d.mts'],
}
