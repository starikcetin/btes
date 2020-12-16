module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: [
        "@typescript-eslint",
        "prettier",
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "react-app",
        "prettier",
        "prettier/@typescript-eslint",
        "prettier/babel",
        "prettier/flowtype",
        "prettier/prettier",
        "prettier/react",
        "prettier/standard",
        "prettier/unicorn",
        "prettier/vue",
    ],
    rules: {
        "prettier/prettier": "error",
    }
};
