/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#eef9ff",
                    500: "#0f7a7a",
                    700: "#0b5b63"
                }
            },
            boxShadow: {
                soft: "0 12px 32px rgba(15, 31, 53, 0.14)"
            }
        }
    },
    plugins: []
};
