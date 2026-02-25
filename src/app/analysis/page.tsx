"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "../../components/ui/Card";
import TimeFilter from "../../components/ui/TimeFilter";
import DownloadButton from "../../components/ui/DownloadButton";
import Dummychart from "../../components/Dummychart";
import { PiThermometerBold } from "react-icons/pi";
import { FaWind } from "react-icons/fa6";
import { MdSunny } from "react-icons/md";
import { BsFillCloudRainFill } from "react-icons/bs";

function WeatherContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Mengambil tab dari URL, default ke 'temperature'
    const activeTab = searchParams.get("tab") || "temperature";

    const navigateTab = (tabName: string) => {
        router.push(`/weather?tab=${tabName}`);
    };

    // Data pembantu agar konten bawah berubah sesuai pilihan
    const tabDetails: Record<string, { label: string; unit: string; value: string }> = {
        temperature: { label: "Temperature", unit: "°C", value: "20" },
        wind: { label: "Wind", unit: "m/s", value: "2" },
        uv: { label: "UV Index", unit: "", value: "10" },
        rainfall: { label: "Rainfall", unit: "mm", value: "10" },
    };

    const current = tabDetails[activeTab] || tabDetails.temperature;

    return (
        <div className="col-span-8 flex flex-col gap-8 p-8 px-15 h-full">           
            {/* 1. Navigasi Card Atas */}
            <div className="grid grid-cols-4 gap-8 min-h-[140px]">         
                <Card 
                    onClick={() => navigateTab("temperature")}
                    hover
                    activeTab={activeTab === "temperature"}
                >
                    <div className="flex flex-col items-start gap-[2px]">
                        <PiThermometerBold size={24} />
                        <p className="text-[14px] font-medium text-inherit">Temperature</p>
                    </div>
                    <div className="flex items-baseline items-end w-full">
                        <div className="text-[48px] font-semibold tracking-tighter">20</div>
                        <p className="text-[30px] font-medium tracking-tighter ml-1">°C</p>
                    </div>
                </Card>

                <Card 
                    onClick={() => navigateTab("wind")}
                    hover
                    activeTab={activeTab === "wind"}
                >
                    <div className="flex flex-col items-start gap-[2px]">
                        <FaWind size={24}/>
                        <p className="text-[14px] font-medium text-inherit">Wind</p>
                    </div>
                    <div className="flex items-baseline items-end w-full">
                        <div className="text-[48px] font-semibold tracking-tighter">2</div>
                        <p className="text-[30px] font-medium tracking-tighter ml-1">m/s</p>
                    </div>
                </Card>

                <Card 
                    onClick={() => navigateTab("uv")}
                    hover
                    activeTab={activeTab === "uv"}
                >
                    <div className="flex flex-col items-start gap-[2px]">
                        <MdSunny size={24}/>
                        <p className="text-[14px] font-medium text-inherit">UV</p>
                    </div>
                    <div className="flex items-baseline items-end w-full">
                        <div className="text-[48px] font-semibold tracking-tighter">10</div>
                        <p className="text-[30px] font-medium tracking-tighter ml-1"></p>
                    </div>
                </Card>

                <Card 
                    onClick={() => navigateTab("rainfall")}
                    hover
                    activeTab={activeTab === "rainfall"}
                >
                    <div className="flex flex-col items-start gap-[2px]">
                        <BsFillCloudRainFill size={24}/>
                        <p className="text-[14px] font-medium text-inherit">Rainfall</p>
                    </div>
                    <div className="flex items-baseline items-end w-full">
                        <div className="text-[48px] font-semibold tracking-tighter">10</div>
                        <p className="text-[30px] font-medium tracking-tighter ml-1">mm</p>
                    </div>
                </Card>
            </div>

            {/* 2. Area Konten Dinamis (Berubah sesuai Card yang diklik) */}
            <div className="w-full mt-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[24px] font-bold text-[#454545]">
                        {current.label} Analytics
                    </h2>
                    
                    <div className="flex gap-3">
                        <TimeFilter />
                        <DownloadButton onClick={() => console.log(`Exporting ${activeTab}...`)} />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-[15px]">
                    {/* Bagian Chart */}
                    <Card className="col-span-8 p-[20px] h-[415px] flex flex-col">
                        <div className="flex-1 w-full">
                            {/* Dummychart sekarang akan me-render ulang setiap activeTab berubah */}
                            <Dummychart />
                        </div>
                    </Card>

                    {/* Bagian Tabel */}
                    <Card className="col-span-4 p-[20px] h-[415px] overflow-hidden">
                        <div className="overflow-y-auto h-full">
                            <table className="w-full text-center text-[13px] border-separate">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr className="text-gray-500">
                                        <th className="py-3 font-medium border-b">Date</th>
                                        <th className="py-3 font-medium border-b">Time</th>
                                        <th className="py-3 font-medium border-b">{current.label}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(10)].map((_, i) => (
                                        <tr key={i} className="text-gray-600 hover:bg-gray-50">
                                            <td className="py-3 px-2">17/02/2026</td>
                                            <td className="py-3 px-2">09:4{i}</td>
                                            <td className="py-3 px-2 font-semibold text-[#10B981]">
                                                {current.value} {current.unit}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function Weather() {
    return (
        <Suspense fallback={<div className="p-10">Loading...</div>}>
            <WeatherContent />
        </Suspense>
    );
}
