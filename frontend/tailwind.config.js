/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            animation: {
                'scan': 'scan 6s linear infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '50%': { transform: 'translateY(100vh)' },
                    '100%': { transform: 'translateY(-100%)' },
                },
                'pulse-glow': {
                    '0%': { boxShadow: '0 0 5px var(--primary)' },
                    '100%': { boxShadow: '0 0 20px var(--primary), 0 0 30px var(--primary)' },
                },
            },
        },
    },
    plugins: [],
} 