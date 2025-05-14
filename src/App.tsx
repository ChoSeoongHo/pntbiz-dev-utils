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
import EpochConverter from "@/components/EpochConverter.tsx";
import CronParser from "@/components/CronParser.tsx";
import JsonPrettier from "@/components/JsonPrettier.tsx";
import UrlEncoder from "@/components/UrlEncoder.tsx";
import { ThemeProvider } from "@mui/material/styles";
import useAppTheme from "@/styles/useAppTheme.ts";
import TodoList from "@/components/todo/TodoList.tsx";
import { TodoProvider } from "@/components/todo/TodoContext.tsx";

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
  const [open, setOpen] = useState(false);
  const [selectedToolKey, setSelectedToolKey] = useState("todo");

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

        <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 100,
              width: 56,
              height: 56,
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
          sx={{ position: "fixed", bottom: 32, right: 32 }}
          icon={<WidgetsIcon />}
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
