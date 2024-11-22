/** @type {import('tailwindcss').Config} */
export default {
    content: ["./app.vue", "./pages/**/*.{vue,js,ts,jsx,tsx}", "./components/**/*.{vue,js,ts,jsx,tsx}", "./layouts/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        screens: {
            "2xl": { max: "1535px" },
            xl: { max: "1279px" },
            lg: { max: "1023px" },
            md: { max: "767px" },
            sm: { max: "639px" }
        }
    },
    plugins: [require("daisyui")],
    daisyui: {
        prefix: "du-",
        logs: false
    },
    darkMode: "selector",
    future: {
        hoverOnlyWhenSupported: true
    }
};
