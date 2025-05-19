import { useState } from "react";
import {
  Box,
  CssBaseline,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  Tooltip,
} from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CodeIcon from "@mui/icons-material/Code";
import LanguageIcon from "@mui/icons-material/Language";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import EpochConverter from "@/components/EpochConverter";
import CronParser from "@/components/CronParser";
import JsonPrettier from "@/components/JsonPrettier";
import UrlEncoder from "@/components/UrlEncoder";
import { ThemeProvider } from "@mui/material/styles";
import TodoList from "@/components/todo/TodoList";
import { TodoProvider } from "@/components/todo/TodoContext";
import AppVersion from "@/components/AppVersion";
import useAppTheme from "@/styles/useAppTheme";
import useLocalStorage from "@/hooks/useLocalStorage";

const tools = [
  {
    key: "todo",
    name: "Todo",
    icon: <ChecklistIcon />,
    component: () => {
      return (
        <TodoProvider>
          <TodoList />
        </TodoProvider>
      );
    },
  },
  {
    key: "epoch",
    name: "Epoch",
    icon: <AccessTimeIcon />,
    component: () => <EpochConverter />,
  },
  {
    key: "cron",
    name: "Cron",
    icon: <DateRangeIcon />,
    component: () => <CronParser />,
  },
  {
    key: "json",
    name: "JSON",
    icon: <CodeIcon />,
    component: () => <JsonPrettier />,
  },
  {
    key: "url",
    name: "URL",
    icon: <LanguageIcon />,
    component: () => <UrlEncoder />,
  },
];

const App = () => {
  const { theme, mode, toggleTheme } = useAppTheme();
  const [selectedToolKey, setSelectedToolKey] = useLocalStorage(
    "selectedToolKey",
    "todo",
  );
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);

  const renderToolComponent = () => {
    const selectedTool =
      tools.find((tool) => tool.key === selectedToolKey) || tools[0];
    return selectedTool.component();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          padding: 4,
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {renderToolComponent()}
        <AppVersion />
        <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              position: "fixed",
              bottom: { xs: 16, sm: 24, md: 32 },
              right: { xs: 80, sm: 100 },
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              zIndex: 1301,
            }}
          >
            {mode === "dark" ? (
              <LightModeIcon sx={{ fontSize: 32 }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 32 }} />
            )}
          </IconButton>
        </Tooltip>
        <SpeedDial
          ariaLabel="Utilities"
          open={open}
          onClick={handleToggle}
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24, md: 32 },
            right: { xs: 16, sm: 24, md: 32 },
            zIndex: 1300,
          }}
          icon={<WidgetsIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />}
        >
          {tools.map((tool) => (
            <SpeedDialAction
              key={tool.key}
              icon={tool.icon}
              slotProps={{
                tooltip: {
                  title: tool.name,
                },
              }}
              onClick={() => setSelectedToolKey(tool.key)}
            />
          ))}
        </SpeedDial>
      </Box>
    </ThemeProvider>
  );
};

export default App;
