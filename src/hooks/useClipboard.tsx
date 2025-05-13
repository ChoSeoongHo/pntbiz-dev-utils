import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

interface Options {
  message?: string;
  duration?: number;
}

const useClipboard = (options?: Options) => {
  const { message = "복사 완료! ✅", duration = 1500 } = options || {};
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      console.error("클립보드 복사 실패", err);
    }
  };

  const reset = () => {
    setCopied(false);
  };

  const renderSnackbar = () => (
    <Snackbar
      open={copied}
      autoHideDuration={duration}
      onClose={reset}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );

  return {
    copy,
    renderSnackbar,
  };
};

export default useClipboard;
