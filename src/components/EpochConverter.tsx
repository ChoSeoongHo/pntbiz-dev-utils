import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Alert,
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
    <Box sx={{ padding: 4, display: "flex", justifyContent: "center" }}>
      <Card
        sx={{ minWidth: 600, maxWidth: 600, minHeight: 350, width: "100%" }}
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
