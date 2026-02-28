"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Card from "../../components/ui/Card";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { HiChevronLeft, HiChevronRight, HiDownload, HiChevronDown } from "react-icons/hi";
import { PiLightningBold, PiWavesBold, PiPlugBold } from "react-icons/pi";
import { MdWarningAmber, MdSignalWifiOff, MdSensors } from "react-icons/md";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface ElectricalDataPoint {
    fullDate: string;
    time: string;
    date: string;
    timestamp: number;
    current: number;
    voltage: number;
    power: number;
}

interface Notification {
    id: number;
    pot: string;
    message: string;
    type: "disconnected" | "sensor" | "warning";
    ago: string;
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const DUMMY_NOTIFICATIONS: Notification[] = [
    { id: 1,  pot: "POT-03", message: "Device disconnected",           type: "disconnected", ago: "2m"  },
    { id: 2,  pot: "POT-11", message: "Humidity sensor error",         type: "sensor",       ago: "5m"  },
    { id: 3,  pot: "POT-22", message: "Device disconnected",           type: "disconnected", ago: "18m" },
    { id: 4,  pot: "POT-07", message: "Temperature sensor timeout",    type: "sensor",       ago: "34m" },
    { id: 5,  pot: "POT-45", message: "Low voltage warning",           type: "warning",      ago: "1h"  },
    { id: 6,  pot: "POT-33", message: "Device disconnected",           type: "disconnected", ago: "2h"  },
    { id: 7,  pot: "POT-18", message: "Water flow sensor error",       type: "sensor",       ago: "3h"  },
    { id: 8,  pot: "POT-50", message: "Overcurrent detected",          type: "warning",      ago: "5h"  },
    { id: 9,  pot: "POT-02", message: "Device disconnected",           type: "disconnected", ago: "6h"  },
    { id: 10, pot: "POT-27", message: "UV sensor unresponsive",        type: "sensor",       ago: "7h"  },
    { id: 11, pot: "POT-39", message: "High temperature warning",      type: "warning",      ago: "8h"  },
    { id: 12, pot: "POT-14", message: "Device disconnected",           type: "disconnected", ago: "10h" },
];

const PARAM_CONFIG = {
    current: { label: "Current",           unit: "mA", color: "#10B981", base: 1200 },
    voltage: { label: "Voltage",           unit: "V",  color: "#3B82F6", base: 220  },
    power:   { label: "Power Consumption", unit: "W",  color: "#F59E0B", base: 264  },
} as const;

// ─── CUSTOM SELECT ────────────────────────────────────────────────────────────
const CustomSelect = ({
    value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: string[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={ref}>
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

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function DevicesPage() {
    const [selectedParam, setSelectedParam] = useState<keyof typeof PARAM_CONFIG>("current");
    const [timeRange, setTimeRange]         = useState("Today");
    const [interval, setInterval]           = useState("5 Minutes");
    const [customStart, setCustomStart]     = useState("");
    const [customEnd, setCustomEnd]         = useState("");
    const [currentPage, setCurrentPage]     = useState(0);
    const [pageInput, setPageInput]         = useState("1");

    const [chartData, setChartData] = useState<ElectricalDataPoint[]>([]);
    const socketRef = useRef<Socket | null>(null);

    const pageSize = 20;
    const nowISO   = new Date().toISOString().slice(0, 16);

    // ─── SOCKET.IO & API CONNECTION ──────────────────────────────────────────
    useEffect(() => {
        // 1. Ambil data histori saat pertama kali buka web
        fetch("http://localhost:4000/api/history")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setChartData(data);
            })
            .catch(err => console.error("Gagal ambil histori:", err));

        // 2. Setup Koneksi Real-time
        socketRef.current = io("http://localhost:4000");

        socketRef.current.on("connect", () => console.log("✅ Terhubung ke Backend"));

        socketRef.current.on("new_data", (newDataPoint: ElectricalDataPoint) => {
            setChartData((prev) => {
                const updated = [...prev, newDataPoint];
                // Simpan maksimal 100 data terakhir di memory browser
                return updated.slice(-100); 
            });
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const latestData = chartData[chartData.length - 1];

    // ── Pagination ──────────────────────────────────────────────────────────
    const totalPages = Math.ceil(chartData.length / pageSize) || 1;

    useEffect(() => {
        setCurrentPage(totalPages - 1);
        setPageInput(totalPages.toString());
    }, [chartData.length, totalPages]);

    const pagedData = useMemo(
        () => chartData.slice(currentPage * pageSize, (currentPage + 1) * pageSize),
        [chartData, currentPage]
    );

    const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPageInput(val);
        const num = parseInt(val);
        if (num > 0 && num <= totalPages) setCurrentPage(num - 1);
    };

    const downloadCSV = () => {
        const headers = ["Date", "Time", "Current (mA)", "Voltage (V)", "Power (W)"];
        const rows    = chartData.map(d => [d.date, d.time, d.current, d.voltage, d.power]);
        const csv     = [headers, ...rows].map(r => r.join(",")).join("\n");
        const blob    = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link    = document.createElement("a");
        link.href     = URL.createObjectURL(blob);
        link.download = `Electrical_${timeRange.replace(/\s+/g, "_")}.csv`;
        link.click();
    };

    const cfg = PARAM_CONFIG[selectedParam];

    return (
        <div className="col-span-8 flex flex-col gap-8 p-8 px-16 h-full">

            {/* ── BARIS 1: STATUS CARDS ─────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-8 shrink-0">
                <StatusCard label="Total Devices"    value="54" subLabel="Installed"  variant="green" />
                <StatusCard label="Active Devices"   value="50" subLabel="Operating"  variant="green" />
                <StatusCard label="Inactive Devices" value="4"  subLabel="Offline"    variant="red"   />
            </div>

            {/* ── BARIS 2: METRIC CARDS ─────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-8 shrink-0">
                <MetricCard
                    label="Current"
                    value={latestData?.current?.toFixed(1) ?? "—"}
                    unit="mA"
                    icon={<PiWavesBold size={24} />}
                    isActive={selectedParam === "current"}
                    onClick={() => setSelectedParam("current")}
                    color="#10B981"
                />
                <MetricCard
                    label="Voltage"
                    value={latestData?.voltage?.toFixed(1) ?? "—"}
                    unit="V"
                    icon={<PiLightningBold size={24} />}
                    isActive={selectedParam === "voltage"}
                    onClick={() => setSelectedParam("voltage")}
                    color="#10B981"
                />
                <MetricCard
                    label="Power Consumption"
                    value={latestData?.power?.toFixed(1) ?? "—"}
                    unit="W"
                    icon={<PiPlugBold size={24} />}
                    isActive={selectedParam === "power"}
                    onClick={() => setSelectedParam("power")}
                    color="#10B981"
                />
            </div>

            {/* ── BARIS 3: CHART + TABLE ────────────────────────────────── */}
            <Card className="bg-white p-6 shadow-sm flex flex-col gap-6 shrink-0">

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-[#1E293B] uppercase tracking-wide">
                                Electrical Analytics
                            </h3>
                            <button
                                onClick={downloadCSV}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981]/80 hover:bg-[#10B981] text-white rounded-[16px] text-xs font-bold transition-all shadow-sm"
                            >
                                <HiDownload className="w-4 h-4" /> CSV
                            </button>
                        </div>

                        {/* Pagination */}
                        <div className="flex gap-2 items-center">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => { const p = currentPage - 1; setCurrentPage(p); setPageInput((p + 1).toString()); }}
                                className="p-2 rounded-md hover:bg-[#1E293B]/10 disabled:opacity-20 border border-[#1E293B]/10 transition-colors"
                            >
                                <HiChevronLeft className="w-5 h-5 text-[#1E293B]" />
                            </button>
                            <div className="flex items-center gap-2 bg-[#1E293B]/3 border border-[#1E293B]/10 px-3 py-2 rounded-lg">
                                <input
                                    type="number" value={pageInput} onChange={handlePageInput}
                                    className="w-10 text-center text-xs font-bold text-[#10B981] bg-transparent outline-none"
                                />
                                <span className="text-xs font-bold text-[#1E293B]/60">of {totalPages}</span>
                            </div>
                            <button
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => { const p = currentPage + 1; setCurrentPage(p); setPageInput((p + 1).toString()); }}
                                className="p-2 rounded-md hover:bg-[#1E293B]/10 disabled:opacity-20 border border-[#1E293B]/10 bg-white transition-colors"
                            >
                                <HiChevronRight className="w-5 h-5 text-[#1E293B]" />
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-wrap gap-3">
                        <CustomSelect
                            value={timeRange} onChange={setTimeRange}
                            options={["Last 5 Minutes","Last 15 Minutes","Last 30 Minutes","Last 1 Hour","Last 6 Hours","Today","Yesterday","Custom Range"]}
                        />
                        {timeRange === "Custom Range" && (
                            <div className="flex gap-2 text-xs items-center bg-[#1E293B]/3 px-3 py-1 rounded-lg border border-[#1E293B]/10">
                                <input type="datetime-local" max={nowISO} value={customStart}
                                    onChange={e => setCustomStart(e.target.value)}
                                    className="bg-transparent text-[11px] font-bold text-slate-600 outline-none" />
                                <span className="text-xs font-bold text-slate-400">to</span>
                                <input type="datetime-local" max={nowISO} value={customEnd}
                                    onChange={e => setCustomEnd(e.target.value)}
                                    className="bg-transparent text-[11px] font-bold text-slate-600 outline-none" />
                            </div>
                        )}
                        <CustomSelect
                            value={interval} onChange={setInterval}
                            options={["1 Minutes","5 Minutes","10 Minutes","30 Minutes","1 Hour"]}
                        />
                    </div>
                </div>

                {/* Chart + Table */}
                <div className="grid grid-cols-12 gap-6 h-[340px]">

                    {/* Chart */}
                    <div className="col-span-8 border border-slate-50 rounded-xl p-4 bg-slate-50/50 flex flex-col h-full">
                        <div className="flex-1 min-h-0 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={pagedData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                                    <defs>
                                        <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor={cfg.color} stopOpacity={0.4} />
                                            <stop offset="95%" stopColor={cfg.color} stopOpacity={0}   />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="time"
                                        tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                                        axisLine={false} tickLine={false}
                                        angle={-45} textAnchor="end" height={70} dx={-5} dy={10}
                                        label={{ value: "Time", position: "insideBottom", offset: 0, fill: "#94A3B8", fontSize: 12, fontWeight: "bold" }} 
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                                        axisLine={false} tickLine={false} width={70}
                                        label={{
                                            value: `${cfg.label} (${cfg.unit})`,
                                            angle: -90, position: "insideLeft", offset: 10,
                                            style: { textAnchor: "middle", fill: "#94A3B8", fontSize: 12, fontWeight: "bold" },
                                        }}
                                    />
                                    <Tooltip
                                        labelStyle={{ fontWeight: "bold" }}
                                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                        labelFormatter={(v) => {
                                            if (typeof v === "string") {
                                                return v;
                                            }
                                            return String(v);
                                        }}
                                        formatter={(val) => {
                                            if (typeof val === "number") {
                                                return [`${val} ${cfg.unit}`, cfg.label];
                                            }
                                            return [String(val), cfg.label];
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey={selectedParam}
                                        name={`${cfg.label} (${cfg.unit})`}
                                        stroke={cfg.color}
                                        strokeWidth={3}
                                        fill="url(#elecGrad)"
                                        fillOpacity={1}
                                        connectNulls
                                        dot={{ r: 4, fill: cfg.color, strokeWidth: 2, stroke: "#fff" }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Table — selalu 3 kolom nilai, tidak ikut filter variabel */}
                    <div className="col-span-4 border border-slate-100 rounded-xl bg-white flex flex-col h-full overflow-hidden">
                        {/* overflow-x-auto + overflow-y-auto agar bisa scroll dua arah */}
                        <div className="overflow-y-auto overflow-x-auto flex-1 styled-scrollbar">
                            <table className="text-[11px] border-separate border-spacing-0" style={{ minWidth: "360px" }}>
                                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="py-3 px-4 font-bold text-slate-500 border-b border-slate-200 text-center whitespace-nowrap">
                                            Date & Time
                                        </th>
                                        <th className="py-3 px-4 font-bold border-b border-slate-200 text-center whitespace-nowrap" style={{ color: PARAM_CONFIG.current.color }}>mA</th>
                                        <th className="py-3 px-4 font-bold border-b border-slate-200 text-center whitespace-nowrap" style={{ color: PARAM_CONFIG.voltage.color }}>V</th>
                                        <th className="py-3 px-4 font-bold border-b border-slate-200 text-center whitespace-nowrap" style={{ color: PARAM_CONFIG.power.color }}>W</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[...pagedData].reverse().map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4 text-slate-400 text-center whitespace-nowrap">
                                                <span className="text-[#1E293B] font-bold block">{row.time}</span>
                                                {row.date}
                                            </td>
                                            <td className="py-3 px-4 font-bold text-[#1E293B] text-center">{row.current}</td>
                                            <td className="py-3 px-4 font-bold text-[#1E293B] text-center">{row.voltage}</td>
                                            <td className="py-3 px-4 font-bold text-[#1E293B] text-center">{row.power}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Card>

            {/* ── BARIS 4: DEVICE LOG ───────────────────────────────────── */}
            <DeviceLog notifications={DUMMY_NOTIFICATIONS} />

        </div>
    );
}

// ─── DEVICE LOG ───────────────────────────────────────────────────────────────
function DeviceLog({ notifications }: { notifications: Notification[] }) {
    const iconMap: Record<Notification["type"], React.ReactNode> = {
        disconnected: <MdSignalWifiOff size={20} />,
        sensor:       <MdSensors size={20} />,
        warning:      <MdWarningAmber size={20} />,
    };
    const colorMap: Record<Notification["type"], { text: string; label: string }> = {
        disconnected: { text: "text-red-500",    label: "bg-red-100 text-red-500"     },
        sensor:       { text: "text-amber-500",  label: "bg-amber-100 text-amber-500"  },
        warning:      { text: "text-orange-500", label: "bg-orange-100 text-orange-500" },
    };
    const typeLabel: Record<Notification["type"], string> = {
        disconnected: "Disconnected",
        sensor:       "Sensor Error",
        warning:      "Warning",
    };

    return (
        <Card className="bg-white shadow-sm flex flex-col p-0 shrink-0 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-lg font-bold text-[#1E293B] uppercase tracking-wide">Device Log</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-1">
                        ({notifications.length} events)
                    </span>
                </div>
                <div className="flex gap-2 text-[10px] font-bold">
                    <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-500">
                        {notifications.filter(n => n.type === "disconnected").length} Disconnected
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-500">
                        {notifications.filter(n => n.type === "sensor").length} Sensor Error
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-500">
                        {notifications.filter(n => n.type === "warning").length} Warning
                    </span>
                </div>
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto max-h-[220px] styled-scrollbar">
                {notifications.map((n, idx) => {
                    const c = colorMap[n.type];
                    return (
                        <div
                            key={n.id}
                            className={`flex items-center gap-4 px-6 py-3 ${
                                idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                            } hover:bg-slate-100/60 transition-colors border-b border-slate-50 last:border-b-0`}
                        >
                            {/* Row number */}
                            <span className="text-[10px] font-bold text-slate-300 w-5 text-right shrink-0">
                                {idx + 1}
                            </span>

                            {/* Icon */}
                            <div className={`${c.text} shrink-0`}>{iconMap[n.type]}</div>

                            {/* POT */}
                            <span className="text-xs font-bold text-[#1E293B] w-16 shrink-0">{n.pot}</span>

                            {/* Type badge */}
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${c.label}`}>
                                {typeLabel[n.type]}
                            </span>

                            {/* Message */}
                            <p className="text-[11px] text-slate-500 font-medium flex-1 min-w-0 truncate">
                                {n.message}
                            </p>

                            {/* Time ago */}
                            <span className="text-[10px] font-bold text-slate-400 shrink-0">{n.ago} ago</span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

// ─── STATUS CARD ──────────────────────────────────────────────────────────────
function StatusCard({ label, value, subLabel, variant }: {
    label: string; value: string; subLabel: string; variant: "green" | "red";
}) {
    const bg = variant === "green" ? "bg-[#10B981]" : "bg-[#EF4444]";
    return (
        <Card className={`w-full flex flex-col justify-between font-semibold ${bg} text-white`}>
            <div className="text-[12px] font-semibold tracking-wider uppercase">{label}</div>
            <div className="flex items-baseline leading-none mt-3">
                <div className="text-4xl font-bold tracking-tighter">{value}</div>
                <p className="text-lg font-bold ml-3 opacity-80">{subLabel}</p>
            </div>
        </Card>
    );
}

// ─── METRIC CARD ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, unit, icon, isActive, onClick, color }: {
    label: string; value: string; unit: string;
    icon: React.ReactNode; isActive: boolean;
    onClick: () => void; color: string;
}) {
    return (
        <div
            onClick={onClick}
            className={`w-full flex flex-col justify-between bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200 border-2 ${
                isActive ? "shadow-md" : "border-slate-100 hover:border-slate-200"
            }`}
            style={{ borderColor: isActive ? color : undefined }}
        >
            <div className="flex items-center gap-2 mb-1">
                <div style={{ color }}>{icon}</div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#1E293B]/60">{label}</p>
            </div>
            <div className="flex items-baseline leading-none w-full mt-2">
                <div className="text-4xl font-bold tracking-tighter text-[#1E293B]">{value}</div>
                {unit && <p className="text-2xl font-bold ml-2 text-[#1E293B]/40">{unit}</p>}
            </div>
        </div>
    );
}
