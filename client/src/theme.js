import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
  
    body: {
      color: 'gray.800',
      bg: '#000000'
    },
  

  colorSchemes: {
    light: {
      primary: {
        50: "#E6FFFA",
        100: "#B2F5EA",
        // Define light mode brand colors here
      },
      // Add more custom colors for light mode if needed
    },
    dark: {
      primary: {
        50: "#112233",
        100: "#001122",
        // Define dark mode brand colors here
      },
      // Add more custom colors for dark mode if needed
    },
  },
});

export default theme;
