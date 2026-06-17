import { BarChart } from "@mantine/charts";
import { Box, Paper, Text } from "@mantine/core";
import { intervalToDuration, format, formatDuration } from "date-fns";

interface ChartTooltipProps {
    label: React.ReactNode;
    payload: readonly Record<string, any>[] | undefined;
}

function ChartTooltip({ label, payload }: ChartTooltipProps) {
    if (!payload) return null;
    const mins = payload.map((item: any) => item.value)[0]
    const duration = intervalToDuration({ start: 0, end: mins * 60 * 1000 })
    const timeMsg = formatDuration(duration, { format: ["hours", "minutes"] })
    return (
        <Paper px="xs" py="xs" shadow="xl" w={100}>
            <Text fw={600} size="xs">
                {timeMsg || "0 minute"} • {label}
            </Text>
        </Paper>
    );
}

type ChartDataType = {
    date: string,
    activity: number
}

export function ActivityChart({ data }: { data: ChartDataType[] }) {
    return <Box
        w={200}
    ><BarChart
            h={50}
            data={data}
            dataKey="date"
            series={[{ name: 'activity', color: 'blue.5' }]}
            gridAxis="none"
            tickLine="none"
            withXAxis={false}
            withYAxis={false}
            tooltipProps={{
                cursor: false,
                content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} />,
            }}
            minBarSize={5}
        /></Box>
}