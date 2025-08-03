/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'segoe': ['Segoe UI', 'system-ui', 'sans-serif'],
      },      colors: {
        'poliba': {
          'primary': '#006B5F',    
          'secondary': '#4A9B8E',  
          'light': '#7FB8AC',      
          'accent': '#00A693',     
          'dark': '#004A42',       
          'bg': '#E8F5F4',         
          'surface': '#D1E7E5',    
        },
        // Dark mode colors
        'poliba-dark': {
          'primary': '#00A693',    
          'secondary': '#4A9B8E',  
          'light': '#006B5F',      
          'accent': '#7FB8AC',     
          'dark': '#E8F5F4',       
          'bg': '#0F1F1C',         
          'surface': '#1A2E29',    
        },
        'chat-bg': '#F5F9F8',
        'user-bg': '#006B5F',
        'bot-bg': '#FFFFFF',
        'border-light': '#E8F4F2',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
      },      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-dots': 'bounce 1.4s infinite ease-in-out',
        'pulse-poliba': 'pulsePoliba 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'theme-transition': 'themeTransition 0.3s ease-in-out',
      },      keyframes: {        fadeIn: {          '0%': {             opacity: '0',            transform: 'translateY(10px) scale(0.95)'          },          '100%': {             opacity: '1',            transform: 'translateY(0) scale(1)'          },        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        pulsePoliba: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.7',
          },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 5px rgba(0, 107, 95, 0.2), 0 0 10px rgba(0, 107, 95, 0.2), 0 0 15px rgba(0, 107, 95, 0.2)',
          },
          '100%': {
            boxShadow: '0 0 10px rgba(0, 107, 95, 0.4), 0 0 20px rgba(0, 107, 95, 0.4), 0 0 30px rgba(0, 107, 95, 0.4)',
          },
        },
        themeTransition: {
          '0%': {
            opacity: '0.8',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      backgroundImage: {
        'gradient-poliba': 'linear-gradient(135deg, #006B5F 0%, #4A9B8E 50%, #7FB8AC 100%)',
        'gradient-poliba-dark': 'linear-gradient(135deg, #004A42 0%, #006B5F 100%)',
        'gradient-user': 'linear-gradient(135deg, #006B5F 0%, #00A693 100%)',
        'gradient-bot': 'linear-gradient(135deg, #FFFFFF 0%, #F5F9F8 100%)',
        'gradient-header': 'linear-gradient(90deg, #006B5F 0%, #4A9B8E 50%, #7FB8AC 100%)',
        // Dark mode gradients
        'gradient-poliba-night': 'linear-gradient(135deg, #00A693 0%, #4A9B8E 50%, #006B5F 100%)',
        'gradient-user-dark': 'linear-gradient(135deg, #00A693 0%, #7FB8AC 100%)',
        'gradient-bot-dark': 'linear-gradient(135deg, #1A2E29 0%, #0F1F1C 100%)',
        'gradient-header-dark': 'linear-gradient(90deg, #00A693 0%, #4A9B8E 50%, #006B5F 100%)',
      },
      boxShadow: {
        'poliba': '0 4px 20px rgba(0, 107, 95, 0.15)',
        'poliba-lg': '0 10px 40px rgba(0, 107, 95, 0.2)',
        'poliba-xl': '0 20px 60px rgba(0, 107, 95, 0.25)',
        'inner-poliba': 'inset 0 2px 4px rgba(0, 107, 95, 0.1)',
      }
    },
  },
  plugins: [],
}
