"use client";
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Data dummy sesuai tampilan jam di gambar
const data = [
    { time: "12:00", value: 33 },
    { time: "12:01", value: 35 },
    { time: "12:02", value: 31 },
    { time: "12:03", value: 31 },
    { time: "12:04", value: 35 },
    { time: "12:05", value: 33 },
    { time: "12:06", value: 33 },
    { time: "12:07", value: 35 },
    { time: "12:08", value: 35 },
    { time: "12:09", value: 36 },
    { time: "12:10", value: 38 },
];

const Dummychart = () => {
    return (
        <div className="w-full h-full min-h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Garis Grid Putus-putus Horizontal saja */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            
            <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                dy={10}
            />
            
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                domain={[0, 50]}
                ticks={[0, 10, 20, 30, 40, 50]}
            />

            <Tooltip 
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />

            <Line
                type="monotone"
                dataKey="value"
                stroke="#6366F1" // Warna ungu kebiruan sesuai gambar
                strokeWidth={2}
                dot={{ r: 4, fill: "#6366F1", strokeWidth: 2, stroke: "#fff" }} // Titik dengan border putih
                activeDot={{ r: 6, strokeWidth: 0 }}
            />
            </LineChart>
        </ResponsiveContainer>
        </div>
    );
};

export default Dummychart;