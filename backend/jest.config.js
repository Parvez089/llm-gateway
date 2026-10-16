export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^cookie$': '<rootDir>/node_modules/cookie/index.js',
    },
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: {
                    target: 'ES2022',
                    module: 'ESNext',
                    moduleResolution: 'Bundler',
                    esModuleInterop: true,
                    lib: ['ES2022'],
                    types: ['node', 'jest'],
                    skipLibCheck: true,
                    allowJs: true,
                },
            },
        ],
    },
    collectCoverageFrom: [
        'src/services/**/*.ts',
        'src/lib/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 65,
            lines: 65,
            statements: 65,
        },
    },
    testMatch: ['**/tests/**/*.test.ts'],
    setupFiles: ['<rootDir>/tests/setup.ts'],
    testTimeout: 30000,
    forceExit: true,
};