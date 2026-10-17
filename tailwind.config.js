/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // -------------------------------------------------------------
        // GRAND DECOR BRAND SYSTEM - QORA + OLTIN
        //   slate  -> issiq qora neytrallar
        //   amber  -> tilla oltin (asosiy aksent)
        //   yellow -> oltin gradient hamkori
        //   rose   -> FUNKSIONAL xavf rangi (faqat xato/o'chirish uchun)
        // -------------------------------------------------------------
        slate: {
          50: '#F4EEE3',
          100: '#EAE2D3',
          200: '#DDD3C0',
          300: '#C7BBA3',
          400: '#A99B82',
          500: '#8A8378',  // Warm Grey — ikkinchi darajali matn
          600: '#57513F',
          700: '#3B362E',
          800: '#211D16',
          900: '#17140F',
          950: '#0D0C0A',  // Chuqur qora — asosiy fon
        },
        // Toza tilla (Pure Gold) - asosiy aksent
        amber: {
          50: '#FFFDF2',
          100: '#FEF7DC',
          200: '#FDEBAF',
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
          700: '#B08A00',
          800: '#8F6E00',
          900: '#6B5300',
        },
        yellow: {
          200: '#FDEBAF',
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
        },
        // XAVF / XATO - faqat funksional holatlar uchun (haqiqiy qizil)
        rose: {
          50: '#FDF2F3',
          100: '#FBE5E7',
          200: '#F6C9CD',
          300: '#EE9CA4',
          400: '#E26D78',
          500: '#D64550',
          600: '#B83540',
          700: '#9A2B35',
          800: '#7A232B',
          900: '#5C1B21',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        // Yagona soya tizimi - "oltin porlash" barcha joyda bir xil
        'glow-sm': '0 4px 14px -4px rgba(255, 193, 7, 0.18)',
        glow: '0 12px 32px -10px rgba(255, 193, 7, 0.28)',
        'glow-lg': '0 20px 50px -12px rgba(255, 193, 7, 0.35)',
      },
      borderRadius: {
        card: '1rem',
        control: '0.75rem',
        shell: '1.5rem',
      },
    },
  },
  plugins: [],
}