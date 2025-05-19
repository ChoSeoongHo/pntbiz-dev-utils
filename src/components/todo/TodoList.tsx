import { useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useClipboard from "@/hooks/useClipboard";
import { v4 as uuidv4 } from "uuid";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useTodos, useTodoDispatch } from "@/components/todo/TodoContext";
import useModal from "@/hooks/useModal";

type DeadlineType = "none" | "date" | "datetime" | "time";

const TodoList = () => {
  const theme = useTheme();
  const todos = useTodos();
  const dispatch = useTodoDispatch();
  const { showModal, renderModal } = useModal({
    content: "이 할 일을 삭제하시겠어요?",
  });
  const { copy, renderSnackbar } = useClipboard();

  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [deadlineType, setDeadlineType] = useState<DeadlineType>("none");
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [error, setError] = useState(false);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError(true);
      return;
    }

    dispatch({
      type: "ADD",
      payload: {
        id: uuidv4(),
        text: trimmed,
        done: false,
        deadline: deadline,
      },
    });

    setInput("");
    setDeadline(null);
    setDeadlineType("none");
  };

  const toggleTodo = (id: string) => {
    dispatch({ type: "TOGGLE", payload: id });
  };

  const deleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return;
    }

    if (todo.done) {
      dispatch({ type: "DELETE", payload: id });
    } else {
      showModal(() => dispatch({ type: "DELETE", payload: id }));
    }
  };

  const saveEdit = (id: string, newText: string) => {
    dispatch({
      type: "EDIT",
      payload: { id, text: newText, deadline: deadline },
    });
    setEditId(null);
    setInput("");
    setDeadline(null);
    setDeadlineType("none");
  };

  const handleCopy = (text: string) => {
    copy(text);
  };

  const renderDeadlinePicker = () => {
    switch (deadlineType) {
      case "date":
        return (
          <DatePicker label="기한" value={deadline} onChange={setDeadline} />
        );
      case "datetime":
        return (
          <DateTimePicker
            label="기한"
            value={deadline}
            onChange={setDeadline}
          />
        );
      case "time":
        return (
          <TimePicker label="기한" value={deadline} onChange={setDeadline} />
        );
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 4, display: "flex", justifyContent: "center" }}>
        <Card sx={{ minWidth: 600, maxWidth: 600, width: "100%" }}>
          <CardHeader title="Todo List" />
          <CardContent>
            <Stack direction="row" spacing={2} mb={2}>
              <TextField
                label="할 일"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (editId) {
                      saveEdit(editId, input);
                    } else {
                      addTodo();
                    }
                  }
                }}
                fullWidth
                error={Boolean(error)}
              />
              <Tooltip title={editId ? "저장" : "추가"}>
                <IconButton
                  color="primary"
                  onClick={() => (editId ? saveEdit(editId, input) : addTodo())}
                >
                  {editId ? <SaveIcon /> : <AddIcon />}
                </IconButton>
              </Tooltip>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Select
                size="small"
                value={deadlineType}
                onChange={(e) =>
                  setDeadlineType(e.target.value as DeadlineType)
                }
              >
                <MenuItem value="none">기한 없음</MenuItem>
                <MenuItem value="date">날짜</MenuItem>
                <MenuItem value="datetime">날짜+시간</MenuItem>
                <MenuItem value="time">시간</MenuItem>
              </Select>
              {renderDeadlinePicker()}
            </Stack>

            {todos.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                할 일이 없습니다.
              </Typography>
            ) : (
              <List>
                {todos.map((todo) => (
                  <ListItem
                    key={todo.id}
                    sx={{
                      backgroundColor: todo.done
                        ? theme.palette.action.selected
                        : theme.palette.background.paper,
                      borderRadius: 1,
                      mb: 1,
                    }}
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => handleCopy(todo.text)}>
                          <ContentCopyIcon />
                        </IconButton>
                        {editId === todo.id ? null : (
                          <IconButton
                            onClick={() => {
                              setInput(todo.text);
                              setEditId(todo.id);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton onClick={() => deleteTodo(todo.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <Checkbox
                      checked={todo.done}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <ListItemText
                      primary={todo.text}
                      secondary={
                        todo.deadline?.format("YYYY-MM-DD HH:mm") ?? ""
                      }
                      sx={{
                        textDecoration: todo.done ? "line-through" : "none",
                        color: todo.done
                          ? theme.palette.text.disabled
                          : theme.palette.text.primary,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
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
          <Alert severity="warning" variant="filled" sx={{ width: "100%" }}>
            할 일을 입력해주세요!
          </Alert>
        </Snackbar>
      </Box>
      {renderModal()}
    </LocalizationProvider>
  );
};

export default TodoList;
