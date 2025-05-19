import { useMediaQuery, useTheme } from "@mui/material";

const ResponsiveDebugger = () => {
  const theme = useTheme();

  const breakpoints = {
    xs: useMediaQuery(theme.breakpoints.only("xs")),
    sm: useMediaQuery(theme.breakpoints.only("sm")),
    md: useMediaQuery(theme.breakpoints.only("md")),
    lg: useMediaQuery(theme.breakpoints.only("lg")),
    xl: useMediaQuery(theme.breakpoints.only("xl")),
  };

  const current =
    Object.entries(breakpoints).find(([_, match]) => match)?.[0] ?? "unknown";

  return <div>breakpoints - {current}</div>;
};

export default ResponsiveDebugger;
