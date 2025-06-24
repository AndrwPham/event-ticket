/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1D0E3C', // The main brand color
                    dark: '#140A2B',    // A darker shade for hover states
                },
                darkBlue: "#1D0E3C",
                secondary: '#F3F4F6', // A light gray for backgrounds/borders
            },
        },
    },
    plugins: [],
};
