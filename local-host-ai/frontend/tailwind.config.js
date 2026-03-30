/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
    theme: {
        extend: {
            boxShadow: {
                soft: "0 12px 34px rgba(15, 23, 42, 0.14)"
            }
        }
    },
    plugins: []
};
