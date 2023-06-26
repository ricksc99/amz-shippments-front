import { extendTheme } from '@chakra-ui/react';

const customSelectTheme = {
  components: {
    Select: {
      baseStyle: {
        fontSize: ["xs", "md"], // Tamaño de fuente personalizado
      },
    },
  },
};

const theme = extendTheme({
  colors: {
    primary: {
      50: "#f9f8ff",
      100: "#e6e4ff",
      200: "#c1bcff",
      300: "#9c93ff",
      400: "#756cff",
      500: "#685cfe", // Tu color principal
      600: "#5e51d4",
      700: "#5143ae",
      800: "#423689",
      900: "#342b6d",
    },
    secondary: '#858585',
  },
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
  fontWeights: {
    light: 200,
    medium: 500,
    bold: 700,
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "light",
        fontSize: ["xs", "md"],
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            fontSize: ["xs", "md"],
          },
        },
      },
    },
    Select: {
      variants: {
        filled: {
          field: {
            fontSize: ["xs", "md"],
          },
        },
      },
    },
    Select: {
      styles: {
        control: {
          fontSize: ["xs", "md"],
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: ["xs", "md"],
      },
    },
    Tab: {
      fontSize: ["xs", "md"],
    },
    ...customSelectTheme,
  },
});

export default theme;