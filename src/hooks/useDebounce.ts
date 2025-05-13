import { useState, useEffect } from "react";

/**
 * useDebounce hook (customed)
 *
 * 입력된 값(value)이 변경될 때마다 delay(ms) 만큼 기다린 후 값이 확정되도록 한다.
 * - 여러번 빠르게 입력하면, 마지막 입력 이후 delay 시간 동안 추가 입력이 없을 때만 갱신한다.
 *
 * @template T - 디바운싱할 값(value)의 타입
 * @param {T} value - 원본 값
 * @param {number} delay 대기할 시간(ms)
 * @returns {T} debouncedValue - delay 이후 확정된 값
 *
 * @example
 * const [input, setInput] = useState('');
 * const debouncedInput = useDebounce(input, 500);
 */
const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
