"use client";

import { useState, useMemo } from "react";
import Card from "../../components/ui/Card";
import FilterDropdown from "../../components/ui/FilterDropdown";
import { PiLightningBold, PiWavesBold, PiPlugBold } from "react-icons/pi";
import CustomBarChart from "../../components/ui/CustomBarChart"; 

export default function DevicesPage() {
    // 1. State untuk Filter
    const [selectedParam, setSelectedParam] = useState("Current");
    const [selectedRange, setSelectedRange] = useState("Today");

    const paramOptions = ["Current", "Voltage", "Power Consumption"];
    const rangeOptions = ["Today", "Last 3 Days", "This Week", "This Month"];

    // 2. Dummy Data Logic - Berubah berdasarkan parameter yang dipilih
    const chartData = useMemo(() => {
        const labels = Array.from({ length: 20 }, (_, i) => `${i + 1}m`);

        const getValues = () => {
            switch (selectedParam) {
                case "Voltage":
                    return labels.map(() => Math.floor(Math.random() * (240 - 210) + 210)); // 210-240V
                case "Power Consumption":
                    return labels.map(() => Math.floor(Math.random() * 500)); // 0-500W
                default:
                    return labels.map(() => Number((Math.random() * 5).toFixed(2))); // 0-5A
            }
        };

        return {
            labels,
            datasets: [
                {
                    label: selectedParam,
                    data: getValues(),
                    backgroundColor: "#10B981",
                    borderRadius: 4,
                },
            ],
        };
    }, [selectedParam, selectedRange]);

    return (
        <div className="col-span-8 flex flex-col gap-8 p-8 px-16 h-screen overflow-hidden">
            {/* BARIS 1: DEVICE SUMMARY */}
            <div className="grid grid-cols-3 gap-6">
                <StatusCard label="Total Devices" value="54" subLabel="Installed" variant="green" />
                <StatusCard label="Active Devices" value="50" subLabel="Operating" variant="green" />
                <StatusCard label="Inactive Devices" value="4" subLabel="Offline" variant="red" />
            </div>

            {/* BARIS 2: ELECTRICAL METRICS */}
            <div className="grid grid-cols-3 gap-6">
                <MetricCard label="Current" value="1.2" unit="A" icon={<PiWavesBold size={20} />} />
                <MetricCard label="Voltage" value="220" unit="V" icon={<PiLightningBold size={20} />} />
                <MetricCard label="Power Consumption" value="264" unit="W" icon={<PiPlugBold size={20} />} />
            </div>

            {/* BARIS 3: BAR CHART SECTION */}
            <Card className="flex-1 flex flex-col p-6 mb-6 bg-white shadow-sm border border-slate-100 min-h-0">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <h3 className="font-bold text-[#1E293B] text-lg leading-tight">Electrical Analytics</h3>
                        <p className="text-[12px] text-slate-400 font-medium">Real-time monitoring per minute</p>
                    </div>

                    <div className="flex gap-3">
                        <FilterDropdown label="Parameter" options={paramOptions} selectedValue={selectedParam} onSelect={setSelectedParam} width="w-48" />
                        <FilterDropdown label="Time Range" options={rangeOptions} selectedValue={selectedRange} onSelect={setSelectedRange} width="w-40" />
                    </div>
                </div>

                {/* Chart Area */}
                <div className="flex-1 flex relative mt-2 min-h-0">
                    <div className="absolute left-[-55px] top-1/2 -rotate-90 origin-center text-[10px] font-bold text-[#1E293B]/30 uppercase tracking-[0.2em] whitespace-nowrap">
                        {selectedParam} ({selectedParam === "Current" ? "A" : selectedParam === "Voltage" ? "V" : "W"})
                    </div>

                    <div className="flex-1 ml-10 h-full w-full">
                        <CustomBarChart data={chartData} />
                    </div>
                </div>

                {/* Label X */}
                <div className="mt-2 text-center text-[10px] font-bold text-[#1E293B]/30 uppercase tracking-[0.2em]">
                    Time Execution ({selectedRange})
                </div>
            </Card>
        </div>
    );
}

/**
 * SUB-COMPONENT: StatusCard
 */
function StatusCard({ label, value, subLabel, variant, onClick }: any) {
    const bgColor = variant === "green" ? "bg-[#10B981]" : "bg-[#EF4444]";
    
    return (
        <Card 
            onClick={onClick}
            className={`w-full flex flex-col justify-between font-semibold ${bgColor} text-white transition-transform active:scale-[0.98] ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="text-[12px] font-semibold tracking-wider uppercase">
                {label}
            </div>
            <div className="flex items-baseline leading-none mt-4">
                <div className="text-4xl font-bold tracking-tighter">{value}</div>
                <p className="text-lg font-bold ml-3 opacity-80">{subLabel}</p>
            </div>
        </Card>
    );
}

/**
 * SUB-COMPONENT: MetricCard
 */
function MetricCard({ label, value, unit, icon }: any) {
    return (
        <Card className="w-full grid grid-cols-1 justify-between bg-white border border-slate-50">
            <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-2 mb-1">
                    <div className="text-[#10B981]">{icon}</div>
                    <p className="text-[12px] text-[#1E293B]/60 font-bold uppercase tracking-wide">{label}</p>
                </div>
            </div>
            <div className="flex items-baseline leading-none w-full mt-2">
                <div className="text-4xl font-bold tracking-tighter text-[#1E293B]">{value}</div>
                {unit && (
                    <p className="text-2xl text-[#1E293B]/40 font-bold ml-2">{unit}</p>
                )}
            </div>
        </Card>
    );
}
