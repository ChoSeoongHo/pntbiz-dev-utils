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

/**
 * Confirm 모달 커스텀 훅
 * @param options 모달 옵션(제목, 내용 텍스트 등)
 * @returns showModal(콜백을 전달해 모달 표시), renderModal(모달 컴포넌트 JSX)
 */
const useModal = (options?: UseModalOptions) => {
  const {
    title = "확인해주세요!",
    content = "이 작업을 진행하시겠어요?",
    confirmText = "확인",
    cancelText = "취소",
  } = options || {};

  const [open, setOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  /**
   * 모달을 열고, 확인 시 실행할 콜백을 설정
   * @param confirmCallback - 사용자가 확인을 눌렀을 때 실행할 함수
   */
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
