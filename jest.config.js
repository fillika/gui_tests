module.exports = {
    rootDir: __dirname,
    testMatch: ["<rootDir>/tests/**/*.test.js"],
    globalSetup: "./jest.globalSetup.js",
    testTimeout: 10000,
};