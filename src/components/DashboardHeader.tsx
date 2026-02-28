"use client";

import { usePathname } from "next/navigation";

function getTitle(pathname: string) {
    if (pathname === "/") return "Dashboard";
    const name = pathname.replace("/", "");
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function DashboardHeader() {
    const pathname = usePathname();

    const dateStr = new Date().toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const timeStr = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <div className="flex justify-between items-center px-16 pt-8 h-[78px]">
            <div>
                <h1 className="font-bold text-xl text-[#1E293B] leading-tight uppercase">
                    {getTitle(pathname)}
                </h1>
                {pathname === "/" ? (
                    <p className="text-sm">
                        <span className="text-[#10B981] font-semibold">Hello,</span>{" "}
                        <span className="text-[#1E293B]/60">welcome to VertIO - Automatic Verticulture!</span>
                    </p>
                ) : (
                    <div className="min-h-0" /> 
                )}
            </div>
            <div className="text-right text-[#1E293B]">
                <div className="font-semibold text-lg leading-tight">{dateStr}</div>
                <div className="text-sm font-medium text-[#1E293B]/60">
                    {timeStr}
                </div>
            </div>
        </div>
    );
}