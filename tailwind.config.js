// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Ensure to include your file paths
  ],
  theme: {
    extend: {
      screens: {
        sm: '375px',  // Small screens (Mobile devices)
        md: '834px',  // Medium screens (Tablets)
        lg: '1440px', // Large screens (Desktops)
      },
      // You can also modify other parts of the theme like colors, spacing, etc.
      colors: {
        primary: '#3490dc',
        secondary: '#ffed4a',
      },
      spacing: {
        18: '4.5rem',
      },
      borderRadius: {
        xl: '1.5rem',
      },
    },
  },
  plugins: [],
};
