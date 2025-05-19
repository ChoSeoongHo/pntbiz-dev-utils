import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { formatDate, formatEpochToDate } from "@/utils/time";
import useClipboard from "@/hooks/useClipboard";

const EpochConverter = () => {
  const theme = useTheme();
  const { copy, renderSnackbar } = useClipboard();

  const currentEpochSeconds = Math.floor(Date.now() / 1000);
  const [now, setNow] = useState(currentEpochSeconds);
  const [unixTime, setUnixTime] = useState(String(currentEpochSeconds));
  const [convertedTime, setConvertedTime] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const id = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(id);
  }, [isPaused]);

  const handleConvert = () => {
    const num = Number(unixTime);
    if (isNaN(num)) {
      setError(true);
      setConvertedTime("");
      return;
    }
    setError(false);
    const date = new Date(num * 1000);
    setConvertedTime(formatDate(date));
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        py: { xs: 2, sm: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          minWidth: { xs: 300, sm: 400, md: 600 },
          maxWidth: { xs: "100%", sm: 600, md: 800, lg: 1000 },
          minHeight: { xs: 0, sm: 300 },
          mx: "auto",
        }}
      >
        <CardHeader title="Epoch Converter" />
        <CardContent>
          <Box
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={() => copy(now.toString())}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              padding: 2,
              borderRadius: 1,
              textAlign: "center",
              mb: 2,
              cursor: "pointer",
              transition: "background-color 0.3s",
              userSelect: "none",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6" color="text.secondary">
              현재 시간: <strong>{now}</strong>
            </Typography>
            <Typography variant="caption" display="block" mt={1}>
              ({formatEpochToDate(now)})
            </Typography>
          </Box>

          <Stack spacing={2} direction="row" mb={3}>
            <TextField
              label="Epoch Second"
              variant="outlined"
              value={unixTime}
              onChange={(e) => setUnixTime(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConvert();
                }
              }}
              fullWidth
              error={Boolean(error)}
            />
            <Button variant="contained" onClick={handleConvert}>
              변환
            </Button>
          </Stack>

          {convertedTime && (
            <Typography variant="body1" mt={4}>
              변환된 시간: <strong>{convertedTime}</strong>
            </Typography>
          )}
        </CardContent>
      </Card>

      {renderSnackbar()}
      <Snackbar
        open={error}
        autoHideDuration={1500}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          입력값을 확인해주세요!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EpochConverter;
