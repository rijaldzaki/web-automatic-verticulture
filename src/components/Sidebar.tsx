"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Cloud, Leaf, Cpu } from "lucide-react";
import Image from "next/image";

const menu = [
    { name: "Home", path: "/", icon: Home, },
    { name: "Weather", path: "/weather", icon: Cloud },
    { name: "Plants", path: "/plants", icon: Leaf },
    { name: "Devices", path: "/devices", icon: Cpu },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 w-[200px] h-screen bg-white p-5">

        <div className="mb-[30px] mt-[15px]">
        <Link href="/">
            <Image 
            src="/logo.png" 
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
                    `flex items-center gap-3 p-3 rounded-[8px] transition ${active ? "bg-[#43C77A]/20 text-[#29A95E]" : "text-[#454545] hover:bg-[#43C77A]/20 hover:text-[#29A95E]"}
                    font-medium text-[14px]
                    `
                }
                >
                <Icon size={18}/>
                {item.name}
                </Link>
            );
            })}

        </nav>

        </aside>
    );
}

