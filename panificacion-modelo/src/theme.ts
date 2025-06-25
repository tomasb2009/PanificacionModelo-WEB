// src/theme.ts
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// 1. Configuración opcional del modo de color
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// 2. Paleta de colores basada en tu imagen
const colors = {
  brand: {
    50: "#F3F3E0", // crema muy claro
    100: "#E8E8D4",
    200: "#DADAC0",
    300: "#DEA757", // dorado cálido (acentos/botones)
    400: "#C99247",
    500: "#27548A", // azul medio (links, CTA)
    600: "#1F4470",
    700: "#183B4E", // azul oscuro (texto principal)
    800: "#122E3A",
    900: "#0D1E28",
  },
};

// 3. Tipografías
const fonts = {
  heading: `'Quicksand', sans-serif`,
  body: `'Quicksand', sans-serif`,
};

// 4. Theme final
export const theme = extendTheme({ config, colors, fonts });
