import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import parser from "cron-parser";
import cronstrue from "cronstrue";
import "cronstrue/locales/ko";
import { Cron } from "react-js-cron";
import "react-js-cron/dist/styles.css";
import "antd/dist/reset.css";
import { formatDate } from "@/utils/time";
import useDebounce from "@/hooks/useDebounce";
import { koreanLocale } from "@/i18n/cron-ko.ts";

const CronParser = () => {
  const [cronExpression, setCronExpression] = useState("0 */5 * * * *");
  const debouncedCronExpression = useDebounce(cronExpression);
  const [mode, setMode] = useState<"raw" | "visual">("raw");
  const [parsedTimes, setParsedTimes] = useState<string[]>([]);
  const [humanText, setHumanText] = useState("");
  const [error, setError] = useState("");
  const [viewType, setViewType] = useState<"next" | "prev">("next");

  const handleCronChange = (val: string) => {
    const parts = val.trim().split(" ");
    if (parts.length === 5) {
      setCronExpression(`0 ${val}`);
    } else {
      setCronExpression(val);
    }
  };

  useEffect(() => {
    const trimedCron = debouncedCronExpression.trim();
    const segments = trimedCron.split(" ");
    if (segments.length < 5) {
      setError("입력을 완료해주세요.");
      setParsedTimes([]);
      setHumanText("");
      return;
    }
    const paddedCron = segments.length === 5 ? `0 ${trimedCron}` : trimedCron;
    console.log(paddedCron);
    try {
      const cron = parser.parse(paddedCron, { strict: false });
      const times: string[] = [];
      for (let i = 0; i < 5; i++) {
        times.push(
          viewType === "prev" ? cron.prev().toString() : cron.next().toString(),
        );
      }
      setParsedTimes(viewType === "prev" ? [...times].reverse() : times);
      setHumanText(cronstrue.toString(paddedCron, { locale: "ko" }));
      setError("");
    } catch (err: unknown) {
      console.error(err);
      setError("잘못된 크론 표현식입니다.");
      setParsedTimes([]);
      setHumanText("");
    }
  }, [debouncedCronExpression, viewType]);

  return (
    <Box sx={{ padding: 4, display: "flex", justifyContent: "center" }}>
      <Card sx={{ minWidth: 1000, maxWidth: 1000, width: "100%" }}>
        <CardHeader title="Cron Playground" />
        <CardContent>
          <Tabs
            value={mode}
            onChange={(_, newValue) => setMode(newValue)}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{ mb: 2, width: "100%" }}
          >
            <Tab label="Raw" value="raw" />
            <Tab label="Builder" value="visual" />
          </Tabs>

          {mode === "raw" ? (
            <TextField
              label="Cron 표현식"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              fullWidth
              error={!!error}
              helperText={error}
            />
          ) : (
            <Cron
              value={cronExpression}
              setValue={handleCronChange}
              locale={koreanLocale}
              shortcuts={["@monthly", "@daily", "@hourly"]}
            />
          )}

          {humanText && (
            <Box mt={3}>
              {mode === "raw" ? (
                <Typography variant="h6" gutterBottom>
                  결과: {humanText}
                </Typography>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    표현식: {cronExpression}
                  </Typography>
                  <Typography variant="body1">결과: {humanText}</Typography>
                </Box>
              )}
            </Box>
          )}
          <Box mt={3}>
            <ToggleButtonGroup
              value={viewType}
              exclusive
              onChange={(_, val) => val && setViewType(val)}
              size="small"
              color="primary"
            >
              <ToggleButton value="prev">이전 실행 시간</ToggleButton>
              <ToggleButton value="next">다음 실행 시간</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {parsedTimes.length > 0 && (
            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom>
                {viewType === "next" ? "예정된 실행 시간" : "과거 실행 시간"}
              </Typography>
              <Stack spacing={1}>
                {parsedTimes.map((time) => (
                  <Typography key={time} variant="body2">
                    {formatDate(new Date(time))}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CronParser;
