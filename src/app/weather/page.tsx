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

    const getStyles = (isActive: boolean) => ({
        icon: isActive ? "text-white" : "text-[#10B981]",
        label: isActive ? "text-white/90" : "text-[#1E293B]/60",
        value: isActive ? "text-white" : "text-[#1E293B]",
        unit: isActive ? "text-white/80" : "text-[#1E293B]/60"
    });

    return (
        <div className="col-span-8 flex flex-col gap-8 p-8 px-15 h-full">
            {/* WEATHER TAB SELECTOR */}
            <div className="grid grid-cols-4 gap-8 min-h-[120px]">
                <WeatherStatCard
                    label="Temperature"
                    value="20"
                    unit="°C"
                    icon={<PiThermometerBold size={24} />}
                    isActive={activeTab === "temperature"}
                    onClick={() => navigateTab("temperature")}
                    styles={getStyles(activeTab === "temperature")}
                />

                <WeatherStatCard
                    label="Wind"
                    value="2"
                    unit="m/s"
                    icon={<FiWind size={24} />}
                    isActive={activeTab === "wind"}
                    onClick={() => navigateTab("wind")}
                    styles={getStyles(activeTab === "wind")}
                />

                <WeatherStatCard
                    label="UV"
                    value="10"
                    unit=""
                    icon={<MdSunny size={24} />}
                    isActive={activeTab === "uv"}
                    onClick={() => navigateTab("uv")}
                    styles={getStyles(activeTab === "uv")}
                />

                <WeatherStatCard
                    label="Rainfall"
                    value="10"
                    unit="mm"
                    icon={<BsFillCloudRainFill size={24} />}
                    isActive={activeTab === "rainfall"}
                    onClick={() => navigateTab("rainfall")}
                    styles={getStyles(activeTab === "rainfall")}
                />
            </div>

            {/* CONTENT DETAIL */}
            <div className="w-full mt-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[20px] font-semibold text-[#1E293B] capitalize">
                        {activeTab}
                    </h2>

                    <div className="flex gap-3">
                        <TimeFilter />
                        <DownloadButton onClick={() => console.log("Downloading CSV...")} />
                    </div>
                </div>

                {activeTab === "temperature" ? (
                    <div className="grid grid-cols-12 gap-[15px]">
                        {/* Main Chart */}
                        <Card className="col-span-8 p-[20px] h-[415px] flex flex-col">
                            <div className="flex-1 w-full">
                                <Dummychart />
                            </div>
                        </Card>

                        {/* Data Table */}
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
                ) : (
                    <Card className="p-20 text-center text-gray-400 border-dashed border-2 bg-gray-50/50">
                        Detail content for <span className="capitalize font-bold text-slate-600">{activeTab}</span> will be here.
                    </Card>
                )}
            </div>
        </div>
    );
}

function WeatherStatCard({
    label,
    value,
    unit,
    icon,
    isActive,
    onClick,
    styles
}: {
    label: string;
    value: string;
    unit: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    styles: any;
}) {
    return (
        <Card
            className="w-full grid grid-cols-1 justify-between min-h-[120px]"
            onClick={onClick}
            hover
            activeTab={isActive}
        >
            <div className="flex items-center gap-2 mb-1 gap-[4px]">
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
