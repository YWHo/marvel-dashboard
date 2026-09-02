import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  clearMocks: true,
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/**/*.spec.{ts,tsx}",
    "!app/**/index.ts",
    "!app/**/*.d.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/**/*.spec.{ts,tsx}"],
  testPathIgnorePatterns: ["<rootDir>/e2e/"],
};

export default createJestConfig(config);
