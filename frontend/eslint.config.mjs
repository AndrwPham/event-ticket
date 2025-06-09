import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";

export default defineConfig([
    // expand tseslint to use strict type check
    ...tseslint.configs.strictTypeChecked,

    // react rules
    reactPlugin.configs.flat.recommended,
    reactHooksPlugin.configs["recommended-latest"],
    jsxA11yPlugin.flatConfigs.recommended,

    // config options
    {
        // enable type inferrence
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            }
        },

        // react version
        settings: {
            react: {
                version: "detect",
            },
        },
    },

    // overriding rules
    {
        rules: {
            "react/react-in-jsx-scope": "off", // no need to import React if not needed
            "@typescript-eslint/no-unused-vars": [ // warn if an unused variable is prefixed with an underscore
                "warn", {
                    "argsIgnorePattern": "^_"
                }
            ]
        },
    },

    // disable all stylistic rules
    eslintConfigPrettier
]);