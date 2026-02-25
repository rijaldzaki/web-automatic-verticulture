"use client";
import React from 'react';
import { 
    PiThermometerBold, 
    PiDropBold, 
    PiWavesBold, 
    PiArrowsDownUpBold 
} from "react-icons/pi";
import { RiWaterPercentLine } from "react-icons/ri";

interface PotData {
    id: string;
    temperature1: number;
    temperature2: number;
    humidity1: number;
    humidity2: number;
    waterLevel: number;
    waterFlow: number;
    valveStatus: 'Open' | 'Closed';
}

interface PotModalProps {
    pot: PotData | null;
    onClose: () => void;
}

export default function PotModal({ pot, onClose }: PotModalProps) {
    if (!pot) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <div className="bg-[#F8FAFC] w-full max-w-2xl rounded-[24px] shadow-2xl p-6 transition-all border border-white">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-[24px] font-bold text-[#1E293B]">
                        ID Device: {pot.id}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-red-500 transition-colors text-2xl font-bold"
                    >
                        ✕
                    </button>
                </div>
                {/* Grid Konten Sensor */}
                <div className="grid grid-cols-3 gap-4 py-6">
                    <StatItem 
                        label="Temperature (Atas)" 
                        value={pot.temperature1} 
                        unit="°C" 
                        icon={<PiThermometerBold size={24} />} 
                    />
                    <StatItem 
                        label="Humidity (Atas)" 
                        value={pot.humidity1} 
                        unit="%" 
                        icon={<PiDropBold size={24} />} 
                    />
                    <StatItem 
                        label="Water Level" 
                        value={pot.waterLevel} 
                        unit="%" 
                        icon={<RiWaterPercentLine size={24} />} 
                    />
                    <StatItem 
                        label="Temperature (Bawah)" 
                        value={pot.temperature2} 
                        unit="°C" 
                        icon={<PiThermometerBold size={24} />} 
                    />
                    <StatItem 
                        label="Humidity (Bawah)" 
                        value={pot.humidity2} 
                        unit="%" 
                        icon={<PiDropBold size={24} />} 
                    />
                    <StatItem 
                        label="Water Flow" 
                        value={pot.waterFlow} 
                        unit="m³/s" 
                        icon={<PiWavesBold size={24} />} 
                    />
                    <div className="col-span-3 p-4 bg-white rounded-[16px] flex justify-between items-center text-[#1E293B] shadow-lg mt-2">
                        <div className="flex items-center gap-2">
                            <PiArrowsDownUpBold size={20} />
                            <span className="text-sm font-bold uppercase tracking-wider">Valve Status</span>
                        </div>
                        <span
                            className={`px-4 py-1 rounded-full text-[12px] font-semibold tracking-widest shadow-sm ${
                                pot.valveStatus === 'Open'
                                    ? 'bg-[#10B981] text-white border border-white/20'
                                    : 'bg-[#EF4444] text-white border border-white/20'
                            }`}
                        >
                            {pot.valveStatus.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Button Detail */}
                <button
                    onClick={() => (window.location.href = `/analysis/${pot.id}`)}
                    className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[14px] font-semibold rounded-[16px] transition-all transform active:scale-[0.98] shadow-md"
                >
                    Detail Analysis
                </button>
            </div>
        </div>
    );
}

function StatItem({ 
    label, 
    value, 
    unit, 
    icon 
}: { 
    label: string; 
    value: string | number; 
    unit: string; 
    icon: React.ReactNode;
}) {
    return (
        <div className="w-full flex flex-col justify-between bg-white p-4 rounded-[16px] shadow-sm border border-slate-100 transition-colors group">
            <div className="flex flex-col items-start gap-1">
                <div className="text-[#3B82F6] mb-1 transition-transform">
                    {icon}
                </div>
                <p className="text-[14px] font-semibold text-[#1E293B]/60 leading-tight">
                    {label}
                </p>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
                <p className="text-[35px] font-bold text-[#1E293B]">
                    {value}
                </p>
                <p className="text-[25px] font-bold text-[#1E293B]/60">
                    {unit}
                </p>
            </div>
        </div>
    );
}