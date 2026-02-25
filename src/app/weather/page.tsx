"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Card from "../../components/ui/Card";
import TimeFilter from "../../components/ui/TimeFilter";
import DownloadButton from "../../components/ui/DownloadButton";
import Dummychart from "../../components/Dummychart";
import { PiThermometerBold } from "react-icons/pi";
import { FiWind } from "react-icons/fi";
import { MdSunny } from "react-icons/md";
import { BsFillCloudRainFill } from "react-icons/bs";

export default function Weather() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const activeTab = searchParams.get("tab") || "temperature";

    const navigateTab = (tabName: string) => {
        router.push(`/weather?tab=${tabName}`);
    };

    return (
        <div className="col-span-8 flex flex-col gap-8 p-8 px-15 h-full">          
            <div className="grid grid-cols-4 gap-8 min-h-[140px]">         
                <Card 
                    className="w-full grid grid-cols-1 justify-between"
                    onClick={() => navigateTab("temperature")}
                    hover
                    activeTab={activeTab === "temperature"}
                >
                    <div className="flex flex-col items-start gap-[2px]">
                        <PiThermometerBold size={24} />
                        <p className="text-[14px] font-medium">Temperature</p>
                    </div>
                    <div className="flex items-baseline leading-none items-end w-full">
                        <div className="text-[48px] font-semibold tracking-tighter">20</div>
                        <p className="text-[30px] font-medium tracking-tighter ml-1">°C</p>
                    </div>
                </Card>
                <Card 
                    className="w-full grid grid-cols-1 justify-between"
                    onClick={() => navigateTab("wind")}
                    hover
                    activeTab={activeTab === "wind"}
                >
                    <div className="flex flex-col items-start gap-[2px]">
                        <FiWind size={24} />
                        <p className="text-[14px] font-medium">Wind</p>
                    </div>
                    <div className="flex items-baseline leading-none items-end w-full">
                        <div className="text-[48px] font-semibold tracking-tighter">2</div>
                        <p className="text-[30px] font-medium tracking-tighter ml-1">m/s</p>
                    </div>
                </Card>
                <Card 
                    className="w-full grid grid-cols-1 justify-between"
                    onClick={() => navigateTab("uv")}
                    hover
                    activeTab={activeTab === "uv"}
                >
                    <div className="flex flex-col items-start gap-[2px]">
                        <MdSunny size={24} />
                        <p className="text-[14px] font-medium">UV</p>
                    </div>
                    <div className="flex items-baseline leading-none items-end w-full">
                        <div className="text-[48px] font-semibold tracking-tighter">10</div>
                        <p className="text-[30px] font-medium tracking-tighter ml-1"></p>
                    </div>
                </Card>
                <Card 
                    className="w-full grid grid-cols-1 justify-between"
                    onClick={() => navigateTab("rainfall")}
                    hover
                    activeTab={activeTab === "rainfall"}
                >
                    <div className="flex flex-col items-start gap-[2px]">
                        <BsFillCloudRainFill size={24} />
                        <p className="text-[14px] font-medium">Rainfall</p>
                    </div>
                    <div className="flex items-baseline leading-none items-end w-full">
                        <div className="text-[48px] font-semibold tracking-tighter">10</div>
                        <p className="text-[30px] font-medium tracking-tighter ml-1">mm</p>
                    </div>
                </Card>
            </div>

            <div className="w-full mt-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[24px] font-bold text-[#454545] capitalize">
                        {activeTab}
                    </h2>
                    
                    <div className="flex gap-3">
                        <TimeFilter />
                        <DownloadButton onClick={() => console.log("Downloading CSV...")} />
                    </div>
                </div>

                {activeTab === "temperature" && (
                    <div className="grid grid-cols-12 gap-[15px]">
                        <Card className="col-span-8 p-[20px] h-[415px] flex flex-col">
                            <div className="flex-1 w-full">
                                <Dummychart />
                            </div>
                        </Card>

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

                {activeTab !== "temperature" && (
                    <Card className="p-20 text-center text-gray-400 border-dashed border-2">
                        Detail content for <span className="capitalize font-bold">{activeTab}</span> will be here.
                    </Card>
                )}
            </div>
        </div>
    );
}
