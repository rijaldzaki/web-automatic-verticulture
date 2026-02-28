"use client";

import { useState, useMemo, useEffect, memo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "../../components/ui/Card";
import { 
    AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area 
} from "recharts";
import { HiChevronLeft, HiChevronRight, HiDownload, HiChevronDown } from "react-icons/hi";
import { PiThermometerBold } from "react-icons/pi";
import { FiWind } from "react-icons/fi";
import { MdSunny } from "react-icons/md";
import { BsFillCloudRainFill } from "react-icons/bs";
import { useWeatherData } from "@/hooks/useWeatherData";

// --- CUSTOM DROPDOWN COMPONENT ---
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

interface WeatherDataPoint {
    fullDate: string;
    time: string;
    date: string;
    timestamp: number;
    value: number;
}

export default function Weather() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const weatherValues = useWeatherData();
    const activeTab = searchParams.get("tab") || "temperature";

    const navigateTab = (tabName: string) => {
        router.push(`/weather?tab=${tabName}`);
    };

    const getStyles = (isActive: boolean) => ({
        icon: isActive ? "text-white" : "text-[#10B981]",
        label: isActive ? "text-white/90" : "text-[#1E293B]/60",
        value: isActive ? "text-white" : "text-[#1E293B]",
        unit: isActive ? "text-white/80" : "text-[#1E293B]/60"
    });

    return (
        /* Container utama: h-screen dan overflow-hidden untuk mencegah scroll body */
        <div className="col-span-8 h-screen overflow-hidden flex flex-col gap-8 p-8 px-15">
            {/* STAT CARDS - Tetap ukurannya (shrink-0) */}
            <div className="grid grid-cols-4 gap-8 min-h-[120px] shrink-0">
                <WeatherStatCard
                    label="Temperature" value={weatherValues.temperatureout.toString()} unit="°C"
                    icon={<PiThermometerBold size={24} />}
                    isActive={activeTab === "temperature"}
                    onClick={() => navigateTab("temperature")}
                    styles={getStyles(activeTab === "temperature")}
                />
                <WeatherStatCard
                    label="Wind Speed" value={weatherValues.wind.toString()} unit="m/s"
                    icon={<FiWind size={24} />}
                    isActive={activeTab === "wind"}
                    onClick={() => navigateTab("wind")}
                    styles={getStyles(activeTab === "wind")}
                />
                <WeatherStatCard
                    label="UV Index" value={weatherValues.uv.toString()} unit=""
                    icon={<MdSunny size={24} />}
                    isActive={activeTab === "uv"}
                    onClick={() => navigateTab("uv")}
                    styles={getStyles(activeTab === "uv")}
                />
                <WeatherStatCard
                    label="Rainfall" value={weatherValues.rainfall.toString()} unit="mm"
                    icon={<BsFillCloudRainFill size={24} />}
                    isActive={activeTab === "rainfall"}
                    onClick={() => navigateTab("rainfall")}
                    styles={getStyles(activeTab === "rainfall")}
                />
            </div>

            {/* DETAIL SECTION - Mengambil sisa layar (flex-1) */}
            <WeatherParameterDetail activeTab={activeTab} />
        </div>
    );
}

const WeatherParameterDetail = memo(({ activeTab }: { activeTab: string }) => {
    const [timeRange, setTimeRange] = useState("Today");
    const [interval, setInterval] = useState("5 Minutes");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInput, setPageInput] = useState("1");
    
    // Page size diubah menjadi 20 sesuai permintaan
    const pageSize = 20;

    const config: Record<string, { title: string; unit: string; base: number; color: string }> = {
        temperature: { title: "Temperature", unit: "°C", base: 28, color: "#10B981" },
        wind: { title: "Wind Speed", unit: "m/s", base: 4, color: "#3B82F6" },
        uv: { title: "UV Index", unit: "", base: 5, color: "#F59E0B" },
        rainfall: { title: "Rainfall", unit: "mm", base: 0.2, color: "#6366F1" }
    };

    const current = config[activeTab] || config.temperature;
    const nowISO = new Date().toISOString().slice(0, 16);

    const chartData = useMemo(() => {
        let points = 50; 
        const now = new Date();
        const data: WeatherDataPoint[] = [];
        const intervalMap: Record<string, number> = { "1 Minutes": 1, "5 Minutes": 5, "10 Minutes": 10, "30 Minutes": 30, "1 Hour": 60 };
        const step = intervalMap[interval] || 5;

        let startTime = now.getTime();

        if (timeRange === "Custom Range" && customStart && customEnd) {
            const start = new Date(customStart).getTime();
            const end = new Date(customEnd).getTime();
            points = Math.max(1, Math.floor((end - start) / (step * 60000)));
            startTime = end;
        } else {
            const rangeMap: Record<string, number> = { 
                "Last 5 Minutes": 5, "Last 15 Minutes": 15, "Last 30 Minutes": 30, 
                "Last 1 Hour": 60, "Last 6 Hours": 360, "Today": now.getHours() * 60 + now.getMinutes(), 
                "Yesterday": 1440 
            };
            points = (rangeMap[timeRange] || 50) / step;
        }

        for (let i = 0; i <= Math.floor(points); i++) {
            const date = new Date(startTime - i * step * 60000);
            const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
            const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
            
            data.push({
                fullDate: `${dateStr} ${timeStr}`,
                time: timeStr,
                date: dateStr,
                timestamp: date.getTime(),
                value: Number((current.base + Math.sin(i / 5) * 2 + Math.random()).toFixed(1))
            });
        }
        return data.sort((a, b) => a.timestamp - b.timestamp);
    }, [activeTab, timeRange, interval, customStart, customEnd, current.base]);

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

    const downloadCSV = () => {
        const headers = ["Date", "Time", `${current.title} (${current.unit})`];
        const rows = chartData.map(d => [d.date, d.time, d.value]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Weather_${activeTab}_${timeRange.replace(/\s+/g, '_')}.csv`;
        link.click();
    };

    const pagedData = useMemo(() => {
        return chartData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    }, [chartData, currentPage]);

    return (
        /* flex-1 min-h-0: Kunci agar container ini fleksibel tapi tidak overflow */
        <Card className="bg-white p-6 shadow-sm flex flex-col gap-6 flex-1 min-h-0 overflow-hidden">
            {/* Header: shrink-0 agar ukurannya tetap saat layar mengecil */}
            <div className="flex flex-col gap-2 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-[#1E293B] uppercase">{current.title}</h3>
                        <button 
                            onClick={downloadCSV} 
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] hover:text-white text-white rounded-[16px] text-xs font-bold transition-all shadow-sm"
                        >
                            <HiDownload className="w-4 h-4" /> CSV
                        </button>
                    </div>
                    
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
                        options={["1 Minutes", "5 Minutes", "10 Minutes", "30 Minutes", "1 Hour"]}
                    />
                </div>
            </div>
            
            {/* CHART & TABLE: grid flex-1 min-h-0 agar mengisi sisa area */}
            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
                {/* CHART WRAPPER */}
                <div className="col-span-8 border border-slate-50 rounded-xl p-4 bg-slate-50/50 flex flex-col min-h-0">
                    <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pagedData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={current.color} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={current.color} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
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
                                    tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    width={70}
                                    label={{ 
                                        value: current.unit ? `${current.title} (${current.unit})` : current.title, 
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
                                
                                {/* Area digabungkan dengan stroke / dot dari Line untuk menghindari tooltip terdobel */}
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    name={current.unit ? `${current.title} (${current.unit})` : current.title}
                                    stroke={current.color} 
                                    strokeWidth={3} 
                                    fill="url(#lineGradient)" 
                                    fillOpacity={1}
                                    connectNulls
                                    dot={{ r: 4, fill: current.color, strokeWidth: 2, stroke: '#fff' }} 
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* TABLE WRAPPER: overflow-hidden pada parent dan overflow-y-auto pada isi */}
                <div className="col-span-4 border border-slate-100 rounded-xl bg-white flex flex-col min-h-0 overflow-hidden">
                    <div className="overflow-y-auto flex-1 styled-scrollbar">
                        <table className="w-full text-center text-[11px] border-separate border-spacing-0">
                            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="py-3 px-4 font-bold text-slate-500 border-b border-slate-200">Date & Time</th>
                                    <th className="py-3 px-4 font-bold border-b border-slate-200" style={{ color: current.color }}>Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[...pagedData].reverse().map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 text-slate-400">
                                            <span className="text-[#1E293B] font-bold block">{row.time}</span> {row.date}
                                        </td>
                                        <td className="py-3 px-4 font-bold text-[#1E293B]">{row.value}</td>
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

function WeatherStatCard({
    label, value, unit, icon, isActive, onClick, styles
}: {
    label: string; value: string; unit: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; styles: any;
}) {
    return (
        <Card
            className="w-full grid grid-cols-1 justify-between min-h-[120px]"
            onClick={onClick}
            hover
            activeTab={isActive}
        >
            <div className="flex items-center gap-2 mb-1">
                <div className={`${styles.icon} transition-colors duration-300`}>
                    {icon}
                </div>
                <p className={`text-[12px] font-semibold uppercase tracking-wide ${styles.label} transition-colors duration-300`}>
                    {label}
                </p>
            </div>
            <div className="flex items-baseline leading-none items-end w-full mt-4">
                <div className={`text-4xl font-semibold tracking-tighter ${styles.value} transition-colors duration-300`}>
                    {value}
                </div>
                {unit && (
                    <p className={`text-2xl font-bold ml-2 ${styles.unit} transition-colors duration-300`}>
                        {unit}
                    </p>
                )}
            </div>
        </Card>
    );
}