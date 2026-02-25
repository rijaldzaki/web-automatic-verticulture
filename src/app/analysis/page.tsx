"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Card from "../../components/ui/Card";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

// Skema Warna untuk maksimal 4 POT
const POT_COLORS = ["#10B981", "#3B82F6", "#EF4444", "#F59E0B"];

// Samakan format dengan Monitoring Page: POT-01, POT-02, ..., POT-54
const ALL_POTS = Array.from({ length: 54 }, (_, i) => `POT-${(i + 1).toString().padStart(2, '0')}`);

export default function AnalysisPage() {
    return (
        <Suspense fallback={<div className="p-8 font-bold text-slate-500">Loading Analysis...</div>}>
            <AnalysisContent />
        </Suspense>
    );
}

function AnalysisContent() {
    const searchParams = useSearchParams();
    
    // 1. Ambil POT dari URL (hasil klik dari Monitoring Page), jika tidak ada gunakan POT-01
    const urlPot = searchParams.get("pot");
    const initialPot = urlPot && ALL_POTS.includes(urlPot) ? urlPot : ALL_POTS[0];
    
    const [selectedPots, setSelectedPots] = useState<string[]>([initialPot]);
    const [potToAdd, setPotToAdd] = useState<string>("");

    // Update daftar POT yang tersedia di dropdown (belum terpilih)
    const availablePots = ALL_POTS.filter((p) => !selectedPots.includes(p));

    // Pastikan potToAdd selalu memiliki nilai valid yang tidak ada di selectedPots
    useEffect(() => {
        if (availablePots.length > 0 && !availablePots.includes(potToAdd)) {
            setPotToAdd(availablePots[0]);
        }
    }, [selectedPots, availablePots, potToAdd]);

    const handleAddPot = () => {
        if (selectedPots.length < 4 && potToAdd && !selectedPots.includes(potToAdd)) {
            setSelectedPots([...selectedPots, potToAdd]);
        }
    };

    const handleRemovePot = (potToRemove: string) => {
        if (selectedPots.length > 1) {
            setSelectedPots(selectedPots.filter((p) => p !== potToRemove));
        }
    };

    return (
        <div className="col-span-8 flex flex-col gap-6 p-8 px-16 bg-[#F8FAFC] min-h-screen">
            
            {/* 1. HEADER GLOBAL: POT SELECTOR */}
            <Card className="p-6 bg-white flex flex-col gap-4 shadow-sm border border-slate-100 z-20 sticky top-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#1E293B]">Comparative Analysis</h2>
                    
                    <div className="flex gap-2 items-center">
                        <select 
                            value={potToAdd}
                            onChange={(e) => setPotToAdd(e.target.value)}
                            className="border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:border-[#10B981] bg-white cursor-pointer"
                            disabled={selectedPots.length >= 4}
                        >
                            {availablePots.map((pot) => (
                                <option key={pot} value={pot}>{pot}</option>
                            ))}
                        </select>
                        <button 
                            onClick={handleAddPot}
                            disabled={selectedPots.length >= 4 || !potToAdd}
                            className="bg-[#10B981] hover:bg-[#059669] disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
                        >
                            + Add POT (Max 4)
                        </button>
                    </div>
                </div>

                {/* List POT yang aktif (Chips) */}
                <div className="flex gap-3 mt-2">
                    {selectedPots.map((pot, index) => (
                        <div 
                            key={pot} 
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-[13px] font-bold shadow-sm transition-all"
                            style={{ backgroundColor: POT_COLORS[index] }}
                        >
                            <span>{pot}</span>
                            {selectedPots.length > 1 && (
                                <button 
                                    onClick={() => handleRemovePot(pot)}
                                    className="hover:bg-black/20 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                                    title="Remove POT"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* 2. DAFTAR PARAMETER */}
            <div className="flex flex-col gap-8 pb-10">
                <ParameterSection title="Temperature (Atas)" unit="°C" activePots={selectedPots} baseValue={28} />
                <ParameterSection title="Temperature (Bawah)" unit="°C" activePots={selectedPots} baseValue={24} />
                <ParameterSection title="Humidity (Atas)" unit="%" activePots={selectedPots} baseValue={75} />
                <ParameterSection title="Humidity (Bawah)" unit="%" activePots={selectedPots} baseValue={80} />
                <ParameterSection title="Water Level" unit="%" activePots={selectedPots} baseValue={40} />
                <ParameterSection title="Water Flow" unit="L/min" activePots={selectedPots} baseValue={15} />
            </div>
        </div>
    );
}

/**
 * SUB-COMPONENT: Parameter Section
 */
function ParameterSection({ title, unit, activePots, baseValue }: any) {
    const [timeRange, setTimeRange] = useState("Today");
    const [interval, setInterval] = useState("5 Minutes");

    // Generator Data Dummy yang Reaktif terhadap filter waktu & interval
    const chartData = useMemo(() => {
        // 1. Tentukan jumlah data berdasarkan Time Range
        let basePoints = 12; // Default "Today"
        if (timeRange === "Last 3 Days") basePoints = 24;
        if (timeRange === "This Week") basePoints = 40;

        // 2. Modifikasi jumlah data berdasarkan Interval
        let multiplier = 1;
        if (interval === "1 Minute") multiplier = 2;
        if (interval === "10 Minutes") multiplier = 0.5;
        
        const totalPoints = Math.floor(basePoints * multiplier);

        return Array.from({ length: totalPoints }).map((_, i) => {
            // Logic format waktu agar terlihat berubah
            let timeLabel = "";
            const minuteStep = interval === "1 Minute" ? 1 : interval === "5 Minutes" ? 5 : 10;
            const minutes = (i * minuteStep) % 60;
            const hours = 10 + Math.floor((i * minuteStep) / 60);

            if (timeRange === "Today") {
                timeLabel = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            } else {
                const dayOffset = Math.floor(i / (totalPoints / 3)) + 1;
                timeLabel = `D${dayOffset} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
            
            let row: any = { time: timeLabel };
            
            // Generate nilai untuk tiap POT menggunakan kombinasi sinus & random agar terlihat seperti data sensor
            activePots.forEach((pot: string, index: number) => {
                const offset = index * 2;
                const wave = Math.sin(i / 2) * 1.5;
                const noise = Math.random() * 1.2;
                row[pot] = Number((baseValue + offset + wave + noise).toFixed(1));
            });
            
            return row;
        });
    }, [activePots, timeRange, interval, baseValue]);

    return (
        <Card className="bg-white p-6 border border-slate-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="text-[16px] font-bold text-[#1E293B] uppercase tracking-wide">{title}</h3>
                
                <div className="flex gap-3">
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#3B82F6] cursor-pointer bg-white"
                    >
                        <option>Today</option>
                        <option>Last 3 Days</option>
                        <option>This Week</option>
                    </select>

                    <select 
                        value={interval} 
                        onChange={(e) => setInterval(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#3B82F6] cursor-pointer bg-white"
                    >
                        <option>1 Minute</option>
                        <option>5 Minutes</option>
                        <option>10 Minutes</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 h-[350px]">
                {/* KIRI: CHART */}
                <div className="col-span-8 h-full border border-slate-50 rounded-xl p-4 bg-slate-50/50">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />
                            <YAxis tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ fontWeight: 'bold', color: '#64748B', marginBottom: '8px' }}
                                itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '15px' }} />
                            
                            {activePots.map((pot: string, index: number) => (
                                <Line 
                                    key={pot} 
                                    type="monotone" 
                                    dataKey={pot} 
                                    stroke={POT_COLORS[index]} 
                                    strokeWidth={3}
                                    dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    animationDuration={500}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* KANAN: TABEL */}
                <div className="col-span-4 h-full overflow-hidden border border-slate-100 rounded-xl">
                    <div className="overflow-y-auto h-full styled-scrollbar">
                        <table className="w-full text-center text-[12px] border-separate border-spacing-0">
                            <thead className="bg-[#F8FAFC] sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="py-3 px-2 font-bold text-slate-500 border-b border-slate-200">Time</th>
                                    {activePots.map((pot: string, index: number) => (
                                        <th key={pot} className="py-3 px-2 font-bold border-b border-slate-200" style={{ color: POT_COLORS[index] }}>
                                            {pot} <span className="text-[10px] font-normal text-slate-400 block -mt-1">{unit}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {chartData.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-2 font-semibold text-slate-500">{row.time}</td>
                                        {activePots.map((pot: string) => (
                                            <td key={pot} className="py-3 px-2 font-bold text-[#1E293B]">
                                                {row[pot]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Card>
    );
}