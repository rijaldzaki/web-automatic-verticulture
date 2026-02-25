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
    // 1. Cek apakah di className yang dikirim ada instruksi warna background kustom
    const hasCustomBg = className.includes("bg-");
    const hasCustomText = className.includes("text-");

    return (
        <div
            onClick={onClick}
            className={`
                rounded-[16px] p-5 shadow-md transition-all duration-200
                ${activeTab ? "bg-[#10B981] text-white" : (!hasCustomBg ? "bg-white" : "")}
                
                ${!activeTab && !hasCustomText ? "text-[#1E293B]" : ""}

                ${hover && !activeTab ? "hover:bg-[#1E293B]/10 cursor-pointer" : ""}
                
                ${className}
            `}
        >
            {children}
        </div>
    );
}