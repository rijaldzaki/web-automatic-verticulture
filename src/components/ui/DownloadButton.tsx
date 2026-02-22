"use client";
import { Download } from "lucide-react";

interface DownloadButtonProps {
    label?: string;
    onClick?: () => void;
}

const DownloadButton = ({ label = "CSV", onClick }: DownloadButtonProps) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 bg-[#29A95E] hover:bg-[#238c4e] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
    >
        <Download size={16} strokeWidth={2.5} />
        <span>{label}</span>
    </button>
);

export default DownloadButton;