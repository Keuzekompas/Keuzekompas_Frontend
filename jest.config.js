const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Zorg dat dit naar je root map wijst
  dir: './',
})

// Custom config die bovenop de Next.js defaults komt
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)