import { BarChart } from "@mantine/charts";
import { Paper, Text } from "@mantine/core";
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
        <Paper px="xs" py="xs" shadow="md">
            <Text fw={600}>
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
    return <BarChart
        h={60}
        data={data}
        dataKey="date"
        series={[{ name: 'activity', color: 'blue.2' }]}
        gridAxis="none"
        tickLine="none"
        withXAxis={false}
        withYAxis={false}
        tooltipProps={{
            cursor: false,
            content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} />,
        }}
        minBarSize={5}
    />
}