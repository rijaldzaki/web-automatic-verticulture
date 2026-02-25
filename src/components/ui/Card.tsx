// Card.tsx
"use client";

export default function Card({
    children,
    className = "",
    hover = false,
    activeTab = false,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    activeTab?: boolean;
    onClick?: () => void;
}) {
    const hasCustomBg = className.includes("bg-");

    return (
        <div
            onClick={onClick}
            className={`
                rounded-[16px] p-5 shadow-md transition-all duration-200
                ${activeTab ? "bg-[#10B981] text-white" : (!hasCustomBg ? "bg-white" : "")}
                ${hover && !activeTab ? "hover:bg-[#1E293B]/10 cursor-pointer" : ""} 
                ${className}
            `}
        >
            {children}
        </div>
    );
}