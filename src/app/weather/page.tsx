"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Thermometer, Wind, Sun, CloudRain } from "lucide-react";
import Card from "../../components/ui/Card";
import TimeFilter from "../../components/ui/TimeFilter";
import DownloadButton from "../../components/ui/DownloadButton";
import Dummychart from "../../components/Dummychart";

export default function Weather() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // 1. Default diubah ke temperature agar konten langsung muncul
    const activeTab = searchParams.get("tab") || "temperature";

    const navigateTab = (tabName:string) => {
        router.push(`/weather?tab=${tabName}`);
    };

    return (
        <div className="flex flex-col gap-[30px] w-full">
            
            <div className="grid grid-cols-4 gap-[15px] h-[180px]">
                
                <Card 
                    onClick={() => navigateTab("temperature")}
                    hover
                    activeTab={activeTab === "temperature"}
                    className={"w-full flex flex-col justify-between p-[12px]"}
                >
                    <div className="flex flex-col items-start">
                        <Thermometer size={25} />
                        <p className="mt-[2px] text-[14px] font-medium">Temperature</p>
                    </div>
                    <div className="flex justify-between items-end w-full">
                        <div className="flex items-baseline leading-none">
                            <p className="text-[48px] font-regular tracking-tighter">20</p>
                            <p className="text-[30px] font-light tracking-tighter ml-0.5">°C</p>
                        </div>
                        <div className="bg-[#43C77A] text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium mb-1.5">
                            Good
                        </div>
                    </div>
                </Card>

                <Card 
                    onClick={() => navigateTab("wind")}
                    hover
                    activeTab={activeTab === "wind"}
                    className={"w-full flex flex-col justify-between p-[12px]"}
                >
                    <div className="flex flex-col items-start">
                        <Wind size={25} />
                        <p className="mt-[2px] text-[14px] font-medium">Wind</p>
                    </div>
                    <div className="flex justify-between items-end w-full">
                        <div className="flex items-baseline leading-none">
                            <p className="text-[48px] font-regular tracking-tighter">2</p>
                            <p className="text-[30px] font-light tracking-tighter ml-0.5">m/s</p>
                        </div>
                        <div className="bg-[#43C77A] text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium mb-1.5">
                            Good
                        </div>
                    </div>
                </Card>

                <Card 
                    onClick={() => navigateTab("uv")}
                    hover
                    activeTab={activeTab === "uv"}
                    className={"w-full flex flex-col justify-between p-[12px]"}
                >
                    <div className="flex flex-col items-start">
                        <Sun size={25} />
                        <p className="mt-[2px] text-[14px] font-medium">UV</p>
                    </div>
                    <div className="flex justify-between items-end w-full">
                        <div className="flex items-baseline leading-none">
                            <p className="text-[48px] font-regular tracking-tighter">10</p>
                            <p className="text-[30px] font-light tracking-tighter ml-0.5"></p>
                        </div>
                        <div className="bg-[#43C77A] text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium mb-1.5">
                            Good
                        </div>
                    </div>
                </Card>

                <Card 
                    onClick={() => navigateTab("rainfall")}
                    hover
                    activeTab={activeTab === "rainfall"}
                    className={"w-full flex flex-col justify-between p-[12px]"}
                >
                    <div className="flex flex-col items-start">
                        <CloudRain size={25} />
                        <p className="mt-[2px] text-[14px] font-medium">Rainfall</p>
                    </div>
                    <div className="flex justify-between items-end w-full">
                        <div className="flex items-baseline leading-none">
                            <p className="text-[48px] font-regular tracking-tighter">10</p>
                            <p className="text-[30px] font-light tracking-tighter ml-0.5">mm</p>
                        </div>
                        <div className="bg-[#43C77A] text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium mb-1.5">
                            Good
                        </div>
                    </div>
                </Card>
            </div>

            {/* SUB-SECTION CONTENT (Muncul di bawah kartu) */}
            <div className="w-full mt-2">
                {/* Header: Judul dan Filter Group */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[24px] font-bold text-[#454545] capitalize">
                        {activeTab}
                    </h2>
                    
                    {/* Kontainer Filter & Download (Komponen Terpisah) */}
                    <div className="flex gap-3">
                        <TimeFilter />
                        <DownloadButton onClick={() => console.log("Downloading CSV...")} />
                    </div>
                </div>

                {/* Area Konten Berdasarkan Tab */}
                {activeTab === "temperature" && (
                    <div className="grid grid-cols-12 gap-[15px]">
                        {/* Card Chart: Mengambil 8 dari 12 kolom (Sekitar 66-70%) */}
                        <Card className="col-span-8 p-[20px] h-[415px] flex flex-col">
                            <div className="flex-1 w-full">
                                {/* Gantilah 'apapun' dengan komponen Chart Anda */}
                                <Dummychart />
                            </div>
                        </Card>

                        {/* Card Tabel: Mengambil 4 dari 12 kolom (Sekitar 30-33%) */}
                        <Card className="col-span-4 p-[20px] h-[415px] overflow-hidden">
                            <div className="overflow-y-auto h-full">
                                <table className="w-full text-center text-[13px] border-separate border-spacing-y-0">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr className="text-gray-500">
                                            <th className="py-3 font-medium border-b border-gray-100">Date</th>
                                            <th className="py-3 font-medium border-b border-gray-100">Time</th>
                                            <th className="py-3 font-medium border-b border-gray-100">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[...Array(10)].map((_, i) => (
                                            <tr key={i} className="text-gray-600 hover:bg-gray-50 transition-colors">
                                                <td className="py-3">17/02/2026</td>
                                                <td className="py-3">09:4{i}</td>
                                                <td className="py-3 font-semibold">30</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Placeholder untuk tab lainnya agar layout tidak kosong */}
                {activeTab !== "temperature" && (
                    <Card className="p-20 text-center text-gray-400 border-dashed border-2">
                        Detail content for <span className="capitalize font-bold">{activeTab}</span> will be here.
                    </Card>
                )}
            </div>
        </div>
    );
}