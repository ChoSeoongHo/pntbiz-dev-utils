export const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  const offsetMinutes = date.getTimezoneOffset();
  const offsetHours = -offsetMinutes / 60;
  const offsetSign = offsetHours >= 0 ? "+" : "-";
  const absOffsetTotalMinutes = Math.abs(offsetMinutes);
  const absOffsetHours = Math.floor(absOffsetTotalMinutes / 60);
  const absOffsetMinutes = absOffsetTotalMinutes % 60;
  let offsetString = `UTC${offsetSign}${absOffsetHours}`;
  if (absOffsetMinutes > 0) {
    offsetString += `:${String(absOffsetMinutes).padStart(2, "0")}`;
  }

  return `${yyyy}년 ${MM}월 ${dd}일 ${HH}시 ${mm}분 ${ss}초 (${offsetString})`;
};

export const formatEpochToDate = (epochSeconds: number): string => {
  const date = new Date(epochSeconds * 1000);
  return formatDate(date);
};
