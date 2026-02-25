"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderRadius: number;
        }[];
    };
}

export default function CustomBarChart({ data }: ChartProps) {
    const formattedData = data.labels.map((label, index) => ({
        name: label,
        value: data.datasets[0].data[index],
    }));

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={formattedData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barGap={8}
                >
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="#E2E8F0"
                    />

                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 500 }}
                        dy={10}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 500 }}
                    />

                    <Tooltip
                        cursor={{ fill: "#F1F5F9" }}
                        content={({ active, payload }) => {
                            if (active && payload?.length) {
                                return (
                                    <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                                            Value
                                        </p>
                                        <p className="text-sm font-bold text-[#1E293B]">
                                            {payload[0].value}
                                            <span className="ml-1 text-[10px] text-slate-400">
                                                {data.datasets[0].label === "Current"
                                                    ? "A"
                                                    : data.datasets[0].label === "Voltage"
                                                        ? "V"
                                                        : "W"}
                                            </span>
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    <Bar
                        dataKey="value"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                        fill={data.datasets[0].backgroundColor}
                        fillOpacity={0.8}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
