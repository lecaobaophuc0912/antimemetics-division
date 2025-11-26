import type { Config } from 'jest';

const config: Config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testEnvironment: 'node',

    // 👇 Ignore tất cả file .module.* khi chạy test
    modulePathIgnorePatterns: [
        '.*\\.module\\..*',
        'main.ts',
        'src/config/*',
        'src/migrations/*',
        'src/types/*'
    ],

    // 👇 Nếu có import file `.module.css`/`.module.scss` --> mock để không gây lỗi
    moduleNameMapper: {
        '\\.module\\.(css|scss|sass)$': 'identity-obj-proxy',
    },
    collectCoverageFrom: [
      "**/*.(t|j)s"
    ],

    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },

    testRegex: '.*\\.spec\\.ts$',
    coverageDirectory: '../coverage',
    coveragePathIgnorePatterns: [
        "\\.module\\.ts"
    ]
};

export default config;
