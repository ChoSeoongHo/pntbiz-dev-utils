import { Box } from "@mui/material";
import { DateFormatType, formatDate } from "@/utils/time";

const AppVersion = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 8,
        left: 16,
        fontSize: 12,
        color: "text.secondary",
      }}
    >
      v{__APP_VERSION__} (
      {formatDate(new Date(__BUILD_DATE__), DateFormatType.HYPHENATED)})
    </Box>
  );
};

export default AppVersion;
