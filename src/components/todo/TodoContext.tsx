import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  useEffect,
} from "react";
import { Dayjs } from "dayjs";
import useLocalStorage from "@/hooks/useLocalStorage";
import dayjs from "dayjs";

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  deadline?: Dayjs | null;
}

type Action =
  | { type: "ADD"; payload: Todo }
  | { type: "DELETE"; payload: string }
  | { type: "TOGGLE"; payload: string }
  | {
      type: "EDIT";
      payload: { id: string; text: string; deadline: Dayjs | null };
    }
  | { type: "SET"; payload: Todo[] };

const TodoContext = createContext<Todo[] | undefined>(undefined);
const TodoDispatchContext = createContext<Dispatch<Action> | undefined>(
  undefined,
);

/**
 * To-do 상태를 변경하는 reducer
 * @param state 현재 To-do 목록
 * @param action 수행할 액션
 * @returns 새로운 To-do 목록 상태
 */
function todoReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "DELETE":
      return state.filter((todo) => todo.id !== action.payload);
    case "TOGGLE":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo,
      );
    case "EDIT":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? {
              ...todo,
              text: action.payload.text,
              deadline: action.payload.deadline ?? todo.deadline,
            }
          : todo,
      );
    case "SET":
      return action.payload;
    default:
      return state;
  }
}

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [storedTodos, setStoredTodos] = useLocalStorage<Todo[]>("my-todos", []);

  const parsedTodos = storedTodos.map((todo) => ({
    ...todo,
    deadline: todo.deadline ? dayjs(todo.deadline) : null,
  }));
  const [state, dispatch] = useReducer(todoReducer, parsedTodos);

  useEffect(() => {
    const serialized = state.map((todo) => ({
      ...todo,
      deadline: todo.deadline ? todo.deadline.toISOString() : null,
    })) as Todo[];
    setStoredTodos(serialized);
  }, [state, setStoredTodos]);

  return (
    <TodoContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
};

/**
 * useTodos: To-do 상태를 반환하는 커스텀 훅
 * @returns 현재 To-do 목록
 */
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodos must be used within a TodoProvider");
  return context;
};

/**
 * useTodoDispatch: To-do 상태를 변경하는 dispatch 함수 반환
 * @returns dispatch 함수
 */
export const useTodoDispatch = () => {
  const context = useContext(TodoDispatchContext);
  if (!context)
    throw new Error("useTodoDispatch must be used within a TodoProvider");
  return context;
};
