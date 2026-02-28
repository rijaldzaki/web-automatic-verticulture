"use client";

import { useState, useMemo, useEffect, useRef, Suspense, memo } from "react";
import { useSearchParams } from "next/navigation";
import Card from "../../components/ui/Card";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { HiChevronLeft, HiChevronRight, HiDownload, HiChevronDown } from "react-icons/hi";

// --- Types ---
interface DataPoint {
    fullDate: string;
    time: string;
    date: string;
    timestamp: number;
    [key: string]: string | number; 
}

const POT_COLORS = ["#10B981", "#3B82F6", "#EF4444", "#F59E0B"];
const ALL_POTS = Array.from({ length: 54 }, (_, i) => `POT-${(i + 1).toString().padStart(2, '0')}`);

// --- CUSTOM DROPDOWN COMPONENT (sama persis dengan Weather) ---
const CustomSelect = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: string[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between whitespace-nowrap border border-[#1E293B]/10 hover:bg-[#1E293B]/5 bg-white rounded-lg px-4 py-2 text-xs font-bold text-[#1E293B]/60 transition-all shadow-sm outline-none"
            >
                <span>{value}</span>
                <HiChevronDown className={`ml-3 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 min-w-full px-2 py-2.5 bg-white border border-[#1E293B]/10 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in duration-200 max-h-52 overflow-y-auto">
                    {options.map((opt) => (
                        <div key={opt} className="flex justify-center py-0.5">
                            <div
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={`w-full whitespace-nowrap px-2.5 py-2.5 text-xs font-semibold text-left rounded-md cursor-pointer transition-colors hover:bg-[#10B981]/20 ${
                                    value === opt ? "bg-[#10B981]/20 text-[#10B981]" : "text-[#1E293B]/60"
                                }`}
                            >
                                {opt}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function AnalysisPage() {
    return (
        <Suspense fallback={<div className="p-8 font-bold text-slate-500">Loading Analysis...</div>}>
            <AnalysisContent />
        </Suspense>
    );
}

function AnalysisContent() {
    const searchParams = useSearchParams();
    const urlPot = searchParams.get("pot");
    const initialPot = urlPot && ALL_POTS.includes(urlPot) ? urlPot : ALL_POTS[0];
    
    const [selectedPots, setSelectedPots] = useState<string[]>([initialPot]);
    const [potToAdd, setPotToAdd] = useState<string>("");

    const availablePotsForComparison = useMemo(() => {
        return ALL_POTS.filter(p => !selectedPots.includes(p));
    }, [selectedPots]);

    useEffect(() => {
        if (!selectedPots.includes(potToAdd) && potToAdd !== "") return;
        setPotToAdd(availablePotsForComparison[0] || "");
    }, [selectedPots, availablePotsForComparison, potToAdd]);

    const handleSwapPrimaryPot = (newId: string) => {
        setSelectedPots(prev => [newId, ...prev.slice(1).filter(id => id !== newId)]);
    };

    const handleAddPot = () => {
        if (selectedPots.length < 4 && potToAdd) {
            setSelectedPots([...selectedPots, potToAdd]);
        }
    };

    const handleRemovePot = (index: number) => {
        if (selectedPots.length > 1) {
            setSelectedPots(selectedPots.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="col-span-8 flex flex-col gap-6 p-8 px-16 min-h-screen">
            {/* === HEADER CARD (tidak diubah) === */}
            <Card className="p-6 bg-white flex flex-col gap-4 shadow-sm border border-slate-100 z-20 sticky top-4">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold uppercase text-[#1E293B]">Comparative Analysis</h2>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Monitor up to 4 devices simultaneously</p>
                    </div>
                    
                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Device</label>
                            <CustomSelect
                                value={selectedPots[0]}
                                onChange={handleSwapPrimaryPot}
                                options={ALL_POTS}
                            />
                        </div>
                        <div className="flex flex-row gap-3 justify-center items-end">
                            <div className="flex flex-col gap-1 justify-center items-center">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Add Comparison</label>
                                <CustomSelect
                                    value={potToAdd}
                                    onChange={setPotToAdd}
                                    options={availablePotsForComparison}
                                />
                            </div>
                            <button 
                                onClick={handleAddPot} 
                                disabled={selectedPots.length >= 4 || !potToAdd} 
                                className="bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-200 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                            >
                                Compare
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-2">
                    {selectedPots.map((pot, index) => (
                        <div key={pot} className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-[13px] font-bold shadow-sm" style={{ backgroundColor: POT_COLORS[index] }}>
                            <span>{index === 0 ? `MAIN: ${pot}` : pot}</span>
                            {index !== 0 && <button onClick={() => handleRemovePot(index)} className="hover:bg-black/20 rounded-full w-5 h-5 flex items-center justify-center transition-colors">✕</button>}
                        </div>
                    ))}
                </div>
            </Card>

            {/* === PARAMETER SECTIONS === */}
            <div className="flex flex-col gap-8 pb-10">
                <ParameterSection title="Temperature (Atas)" unit="°C" activePots={selectedPots} baseValue={28} />
                <ParameterSection title="Temperature (Bawah)" unit="°C" activePots={selectedPots} baseValue={24} />
                <ParameterSection title="Humidity (Atas)" unit="%" activePots={selectedPots} baseValue={75} />
                <ParameterSection title="Humidity (Bawah)" unit="%" activePots={selectedPots} baseValue={80} />
                <ParameterSection title="Water Level" unit="%" activePots={selectedPots} baseValue={40} />
                <ParameterSection title="Water Flow" unit="L/min" activePots={selectedPots} baseValue={15} />
                <ParameterSection title="Valve Status" unit="Status" activePots={selectedPots} baseValue={0} isDigital />
            </div>
        </div>
    );
}

const ParameterSection = memo(({ title, unit, activePots, baseValue, isDigital }: any) => {
    const [timeRange, setTimeRange] = useState("Today");
    const [interval, setInterval] = useState("5 menit");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInput, setPageInput] = useState("1");

    const pageSize = 20;
    const nowISO = new Date().toISOString().slice(0, 16);

    // --- Data Generation ---
    const chartData = useMemo(() => {
        let points = 50; 
        const now = new Date();
        const data: DataPoint[] = [];
        const intervalMap: Record<string, number> = { "1 menit": 1, "5 menit": 5, "10 menit": 10, "30 menit": 30, "1 jam": 60 };
        const step = intervalMap[interval] || 5;

        let startTime = now.getTime();

        if (timeRange === "Custom Range" && customStart && customEnd) {
            const start = new Date(customStart).getTime();
            const end = new Date(customEnd).getTime();
            points = Math.max(1, Math.floor((end - start) / (step * 60000)));
            startTime = end;
        } else {
            const rangeMap: Record<string, number> = { "Last 5 Minutes": 5, "Last 15 Minutes": 15, "Last 30 Minutes": 30, "Last 1 Hour": 60, "Last 6 Hours": 360, "Today": now.getHours() * 60 + now.getMinutes(), "Yesterday": 1440 };
            points = (rangeMap[timeRange] || 50) / step;
        }

        for (let i = 0; i <= Math.floor(points); i++) {
            const date = new Date(startTime - i * step * 60000);
            const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
            const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
            
            let row: DataPoint = { fullDate: `${dateStr} ${timeStr}`, time: timeStr, date: dateStr, timestamp: date.getTime() };
            activePots.forEach((pot: string, idx: number) => {
                if (isDigital) {
                    row[pot] = Math.random() > 0.5 ? 1 : 0;
                } else {
                    row[pot] = Number((baseValue + (idx * 2) + Math.sin(i / 5) * 2 + Math.random()).toFixed(1));
                }
            });
            data.push(row);
        }
        return data.sort((a, b) => a.timestamp - b.timestamp);
    }, [activePots, timeRange, interval, baseValue, isDigital, customStart, customEnd]);

    // --- Pagination ---
    const totalPages = Math.ceil(chartData.length / pageSize) || 1;

    useEffect(() => {
        setCurrentPage(totalPages - 1);
        setPageInput((totalPages).toString());
    }, [chartData.length, totalPages]);

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPageInput(val);
        const num = parseInt(val);
        if (num > 0 && num <= totalPages) {
            setCurrentPage(num - 1);
        }
    };

    const pagedData = useMemo(() => {
        return chartData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    }, [chartData, currentPage]);

    const downloadCSV = () => {
        const headers = ["Date", "Time", ...activePots.map((p: string) => `${p} (${unit})`)];
        const rows = chartData.map((d: DataPoint) => [
            d.date, d.time, ...activePots.map((p: string) => isDigital ? (d[p] === 1 ? "OPEN" : "CLOSED") : d[p])
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${title}_${timeRange}.csv`;
        link.click();
    };

    return (
        <Card className="bg-white p-6 shadow-sm flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2 shrink-0">
                <div className="flex justify-between items-center">
                    {/* Kiri: Judul + Tombol CSV */}
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-[#1E293B] uppercase">{title}</h3>
                        <button 
                            onClick={downloadCSV} 
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981]/80 hover:bg-[#10B981] hover:text-white text-white rounded-[16px] text-xs font-bold transition-all shadow-sm"
                        >
                            <HiDownload className="w-4 h-4" /> CSV
                        </button>
                    </div>

                    {/* Kanan: Pagination (input number style Weather) */}
                    <div className="flex gap-2 items-center">
                        <button 
                            disabled={currentPage === 0} 
                            onClick={() => {
                                const newPage = currentPage - 1;
                                setCurrentPage(newPage);
                                setPageInput((newPage + 1).toString());
                            }} 
                            className="p-2 rounded-md hover:bg-[#1E293B]/10 disabled:opacity-20 border border-[#1E293B]/10 transition-colors"
                        >
                            <HiChevronLeft className="w-5 h-5 text-[#1E293B]" />
                        </button>
                        
                        <div className="flex items-center gap-2 bg-[#1E293B]/3 border border-[#1E293B]/10 px-3 py-2 rounded-lg">
                            <input 
                                type="number"
                                value={pageInput}
                                onChange={handlePageInputChange}
                                className="w-10 text-center text-xs font-bold text-[#10B981] bg-transparent outline-none"
                            />
                            <span className="text-xs font-bold text-[#1E293B]/60">of {totalPages}</span>
                        </div>

                        <button 
                            disabled={currentPage >= totalPages - 1} 
                            onClick={() => {
                                const newPage = currentPage + 1;
                                setCurrentPage(newPage);
                                setPageInput((newPage + 1).toString());
                            }} 
                            className="p-2 rounded-md hover:bg-[#1E293B]/10 disabled:opacity-20 border border-[#1E293B]/10 bg-white transition-colors"
                        >
                            <HiChevronRight className="w-5 h-5 text-[#1E293B]" />
                        </button>
                    </div>
                </div>

                {/* Filter Bar (CustomSelect style Weather) */}
                <div className="flex flex-wrap gap-3">
                    <CustomSelect 
                        value={timeRange} 
                        onChange={setTimeRange} 
                        options={["Last 5 Minutes", "Last 15 Minutes", "Last 30 Minutes", "Last 1 Hour", "Last 6 Hours", "Today", "Yesterday", "Custom Range"]}
                    />

                    {timeRange === "Custom Range" && (
                        <div className="flex gap-2 text-xs items-center bg-[#1E293B]/3 px-3 py-1 rounded-lg border border-[#1E293B]/10">
                            <input 
                                type="datetime-local"
                                max={nowISO}
                                className="bg-transparent text-[11px] font-bold text-slate-600 outline-none" 
                                value={customStart} 
                                onChange={(e) => setCustomStart(e.target.value)} 
                            />
                            <span className="text-xs font-bold text-slate-400">to</span>
                            <input 
                                type="datetime-local"
                                max={nowISO}
                                className="bg-transparent text-[11px] font-bold text-slate-600 outline-none" 
                                value={customEnd} 
                                onChange={(e) => setCustomEnd(e.target.value)} 
                            />
                        </div>
                    )}

                    <CustomSelect 
                        value={interval} 
                        onChange={setInterval} 
                        options={["1 menit", "5 menit", "10 menit", "30 menit", "1 jam"]}
                    />
                </div>
            </div>

            {/* Chart + Table */}
            <div className={`grid grid-cols-12 gap-6 h-[380px]`}>
                {/* Chart — hanya tampil jika bukan digital */}
                {!isDigital && (
                    <div className="col-span-8 h-full border border-slate-50 rounded-xl p-4 bg-slate-50/50">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={pagedData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis 
                                    dataKey="time" 
                                    tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} 
                                    axisLine={false} 
                                    tickLine={false}
                                    angle={-45}
                                    textAnchor="end"
                                    height={70}
                                    dx={-5}
                                    dy={10}
                                    label={{ value: 'Time', position: 'insideBottom', offset: 0, fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' }}
                                />
                                <YAxis 
                                    domain={['auto', 'auto']} 
                                    tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} 
                                    axisLine={false} 
                                    tickLine={false}
                                    width={70}
                                    label={{ 
                                        value: unit ? `${title} (${unit})` : title, 
                                        angle: -90, 
                                        position: 'insideLeft', 
                                        offset: 10,
                                        style: { textAnchor: 'middle', fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' } 
                                    }}
                                />
                                <Tooltip 
                                    labelStyle={{ fontWeight: 'bold' }} 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(value, payload) => payload?.[0] ? `${payload[0].payload.date}, ${value}` : value}
                                />
                                <Legend 
                                    wrapperStyle={{ 
                                        fontSize: '11px', 
                                        fontWeight: 700, 
                                        paddingTop: '15px',
                                        paddingLeft: '80px'
                                    }} 
                                    align="center"
                                />
                                {activePots.map((pot: string, index: number) => (
                                    <Line 
                                        key={pot} 
                                        type="monotone"
                                        dataKey={pot} 
                                        stroke={POT_COLORS[index]} 
                                        strokeWidth={3} 
                                        dot={{ r: 4, fill: POT_COLORS[index], strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Table — full width jika digital, 4 kolom jika ada chart */}
                <div className={`${isDigital ? 'col-span-12' : 'col-span-4'} border border-slate-100 rounded-xl bg-white flex flex-col min-h-0 overflow-hidden`}>
                    <div className="overflow-y-auto flex-1 styled-scrollbar">
                        <table className="w-full text-center text-[11px] border-separate border-spacing-0">
                            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="py-3 px-4 font-bold text-slate-500 border-b border-slate-200">Date & Time</th>
                                    {activePots.map((pot: string, index: number) => (
                                        <th key={pot} className="py-3 px-4 font-bold border-b border-slate-200" style={{ color: POT_COLORS[index] }}>{pot}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[...pagedData].reverse().map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 text-slate-400">
                                            <span className="text-[#1E293B] font-bold block">{row.time}</span> {row.date}
                                        </td>
                                        {activePots.map((pot: string) => (
                                            <td key={pot} className={`py-3 px-4 font-bold ${isDigital ? (row[pot] === 1 ? 'text-[#10B981]' : 'text-[#EF4444]') : 'text-[#1E293B]'}`}>
                                                {isDigital ? (row[pot] === 1 ? 'OPEN' : 'CLOSED') : row[pot]}
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
});