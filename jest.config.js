/* eslint-disable @typescript-eslint/no-require-imports */
const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.test.{ts,tsx}'],
  transform: {
    ...tsJestTransformCfg,
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/test/unit/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(better-auth|@better-auth|@noble|@noble/ciphers|nanostores|@nanostores|mongoose|bson|mongodb))',
  ],
};
