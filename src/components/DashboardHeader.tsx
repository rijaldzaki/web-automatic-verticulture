"use client";

import { usePathname } from "next/navigation";

function getTitle(pathname: string) {
    if (pathname === "/") return "Welcome to VertIO - Automatic Verticulture";
    const name = pathname.replace("/", "");
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function DashboardHeader() {

    const pathname = usePathname();

    const now = new Date().toLocaleString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const time = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="flex justify-between items-center mt-[20px] mb-[30px]">

        {/* ATUR SIZE FONT DI SINI */}
        <h1 className="font-semibold text-[25px]">
            {getTitle(pathname)}
        </h1>

        <div className="text-[14px] opacity-70">
            {now} &nbsp;&nbsp; {time}
        </div>

        </div>
    );
}
