import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface UseModalOptions {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
}

const useModal = (options?: UseModalOptions) => {
  const {
    title = "확인해주세요!",
    content = "이 작업을 진행하시겠습니까?",
    confirmText = "삭제",
    cancelText = "취소",
  } = options || {};

  const [open, setOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  const showModal = (confirmCallback: () => void) => {
    setOnConfirm(() => confirmCallback);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const renderModal = () => (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{cancelText}</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return {
    showModal,
    renderModal,
  };
};

export default useModal;
