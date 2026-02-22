"use client";

export default function Card({
    children,
    className="",
    hover=false,
    activeTab=false,
    onClick,
    }:{
    children:React.ReactNode;
    className?:string;
    hover?:boolean;
    activeTab?:boolean;
    onClick?:()=>void;
    }) {
    return (
        <div
        onClick={onClick}
        className={`
            "bg-white rounded-[8px] p-[15px] transition text-[#454545]"
        
            ${hover ? "hover:bg-gradient-to-t hover:from-[#29A95E] hover:to-[#43C77A] hover:text-white cursor-pointer" : ""}
            ${activeTab ? "bg-gradient-to-t from-[#29A95E] to-[#43C77A] text-white" : "bg-white text-[#454545]"}
            ${className}
        `}
        >
        {children}
        </div>
    );
}
