import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      50: "#daf6ff",
      100: "#addeff",
      200: "#7cc6ff",
      300: "#4aafff",
      400: "#1a98ff",
      500: "#007ee6",
      600: "#0062b4",
      700: "#004682",
      800: "#002a51",
      900: "#000f21",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
