import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from "@mui/material/styles";
import useLocalStorage from "@/hooks/useLocalStorage";
import { PaletteMode } from "@mui/material";
import { useMemo } from "react";

const useAppTheme = () => {
  const [mode, setMode] = useLocalStorage<PaletteMode>("app-theme", "light");

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, mode, toggleTheme };
};

interface CustomThemeOptions extends ThemeOptions {
  palette: NonNullable<ThemeOptions["palette"]> & {
    mode: PaletteMode;
  };
}

const baseOptions: Omit<CustomThemeOptions, "palette"> = {
  typography: {
    fontFamily:
      '"Noto Sans KR", "system-ui", "Avenir", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "3.2em",
      lineHeight: 1.1,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "1em",
    },
  },
};

const createAppTheme = (mode: PaletteMode = "light") =>
  responsiveFontSizes(
    createTheme({
      ...baseOptions,
      palette: {
        mode,
        primary: {
          main: "#FF5F2C",
        },
        secondary: {
          main: "#FFD1C3",
        },
        ...(mode === "dark"
          ? {
              background: {
                default: "#121212",
                paper: "#1E1E1E",
              },
              text: {
                primary: "#FFFFFF",
                secondary: "#CCCCCC",
              },
            }
          : {}),
      },
    }),
  );

export default useAppTheme;
