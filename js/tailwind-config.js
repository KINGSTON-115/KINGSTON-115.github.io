tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                display: ['"Syne"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
                sans: ['"Noto Sans SC"', '"Oswald"', 'sans-serif'],
            },
            colors: {
                'acid-green': '#ccff00',
                'acid': '#ccff00',
                'acid-dim': 'rgba(204, 255, 0, 0.1)',
                'acid-dark': '#1a2200',
                'electric-blue': '#2b60ff',
                'deep-void': '#050505',
                'dark-bg': '#050505',
                'panel-gray': '#111111',
                'panel-bg': '#0a0a0a',
                'black': '#050505'
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)",
            },
            animation: {
                'marquee-infinite': 'marquee 30s linear infinite',
                'scanline': 'scanline 8s linear infinite',
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'blink': 'blink 1s step-end infinite'
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                }
            }
        }
    }
}
