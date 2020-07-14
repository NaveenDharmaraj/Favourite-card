/*
https://jestjs.io/docs/en/configuration
*/

module.exports = {
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/styleMock.js',
    },
    setupFiles: [
        '<rootDir>/setupTests.js',
    ],
    testMatch: [
        '**/__tests__/**/*.(spec|test).(js|jsx)',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
    ],
};
