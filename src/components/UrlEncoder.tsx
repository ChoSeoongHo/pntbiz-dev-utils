import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const UrlEncoder = () => {
  const [input, setInput] = useState("");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");

  const handleEncode = () => {
    try {
      setEncoded(encodeURIComponent(input));
    } catch (error) {
      console.error("인코딩 실패", error);
    }
  };

  const handleDecode = () => {
    try {
      setDecoded(decodeURIComponent(input));
    } catch (error) {
      console.error("디코딩 실패", error);
    }
  };

  const handleClear = () => {
    setInput("");
    setEncoded("");
    setDecoded("");
  };

  return (
    <Box sx={{ padding: 4, display: "flex", justifyContent: "center" }}>
      <Card
        sx={{ minWidth: 600, maxWidth: 600, minHeight: 350, width: "100%" }}
      >
        <CardContent>
          <Typography variant="h5" mb={2}>
            URL Encoder
          </Typography>

          <TextField
            label="입력 문자열"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            sx={{ mb: 3 }}
          />

          <Stack direction="row" spacing={2} mb={3}>
            <Button
              variant="contained"
              onClick={handleEncode}
              disabled={!input}
            >
              Encode
            </Button>
            <Button variant="outlined" onClick={handleDecode} disabled={!input}>
              Decode
            </Button>
            <Button variant="text" color="error" onClick={handleClear}>
              Reset
            </Button>
          </Stack>

          {encoded && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Encoded
              </Typography>
              <TextField
                value={encoded}
                fullWidth
                multiline
                minRows={2}
                slotProps={{ input: { readOnly: true } }}
                sx={{ mb: 3 }}
              />
            </>
          )}

          {decoded && (
            <>
              <Typography variant="subtitle1">Decoded</Typography>
              <TextField
                value={decoded}
                fullWidth
                multiline
                minRows={2}
                slotProps={{ input: { readOnly: true } }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UrlEncoder;
