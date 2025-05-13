import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import useClipboard from "@/hooks/useClipboard.tsx";
import useDebounce from "@/hooks/useDebounce.ts";

const fixJsonInput = (input: string): string =>
  input.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

const JsonPrettier = () => {
  const [input, setInput] = useState('{"hello":"world!"}');
  const debouncedInput = useDebounce(input, 1000);
  const [formatted, setFormatted] = useState("");
  const { copy, renderSnackbar } = useClipboard();
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    const fixed = fixJsonInput(debouncedInput);
    try {
      const json = JSON.parse(fixed);
      const pretty = JSON.stringify(json, null, 2);
      setFormatted(pretty);
      setError("");
    } catch (err) {
      console.error(err);
      setFormatted("");
      setError("유효하지 않은 JSON입니다.");
    }
  }, [debouncedInput]);

  return (
    <Box sx={{ padding: 4, display: "flex", justifyContent: "center" }}>
      <Card sx={{ minWidth: 600, maxWidth: 600 }}>
        <CardHeader title="JSON Prettier" />
        <CardContent>
          <TextField
            multiline
            minRows={6}
            value={input}
            onChange={handleChange}
            fullWidth
            error={!!error}
            helperText={error || "유효한 JSON을 입력하면 자동으로 포맷됩니다."}
            sx={{
              maxHeight: 300,
              overflow: "auto",
              "& .MuiInputBase-root": {
                height: "100%",
                alignItems: "start",
              },
            }}
          />

          {formatted && (
            <Box mt={3} position="relative">
              <Typography variant="subtitle1" gutterBottom>
                결과
              </Typography>

              <Box position="relative">
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: 8,
                    padding: 16,
                    fontSize: "0.875rem",
                    backgroundColor: "#1e1e1e",
                    maxHeight: 300,
                    overflow: "auto",
                  }}
                  wrapLongLines
                  wrapLines
                >
                  {formatted}
                </SyntaxHighlighter>

                <IconButton
                  onClick={() => copy(formatted)}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 32,
                    color: "white",
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
      {renderSnackbar()}
    </Box>
  );
};

export default JsonPrettier;
