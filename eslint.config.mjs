import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = [
    {
        files: ["*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            "@typescript-eslint/no-inferrable-types": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
    {
        ignores: ["node_modules/**"],
    },
];

export default eslintConfig;
