"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsGrid1X2Fill, BsCloudSunFill } from "react-icons/bs";
import { PiPlantFill } from "react-icons/pi";
import { FaChartSimple, FaMicrochip } from "react-icons/fa6";
import Image from "next/image";

const menu = [
    { name: "Dashboard", path: "/", icon: BsGrid1X2Fill, },
    { name: "Weather", path: "/weather", icon: BsCloudSunFill },
    { name: "Monitoring", path: "/monitoring", icon: PiPlantFill },
    { name: "Analysis", path: "/analysis", icon: FaChartSimple },
    { name: "Devices", path: "/devices", icon: FaMicrochip },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed w-[240px] h-screen bg-[#1E293B] p-8 pt-10">

        <div className="mb-[50px] items-center flex flex-col juston-center">
        <Link href="/">
            <Image 
            src="/logo.svg" 
            alt="VertIO Logo"
            width={140} 
            height={38} 
            className="object-contain"
            priority 
            />
        </Link>
        </div>
        
        <nav className="flex flex-col gap-1">

            {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
                <Link
                key={item.path}
                href={item.path}
                className={
                    `flex items-center gap-3 p-3 rounded-xl transition ${active ? "bg-[#10B981] text-white" : "text-[#ffffff]/60 hover:bg-[#ffffff]/20 hover:text-[#ffffff]/80"}
                    font-medium text-[14px]
                    `
                }
                >
                <Icon size={24}/>
                {item.name}
                </Link>
            );
            })}

        </nav>

        </aside>
    );
}

