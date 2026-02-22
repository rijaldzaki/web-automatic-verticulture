import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
    label: string;
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    width?: string;
}

const FilterDropdown = ({ label, options, selectedValue, onSelect, width = "w-32" }: FilterDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Menutup dropdown jika klik di luar area
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#454545]/15 rounded-[8px] text-[14px] font-medium text-[#454545] hover:bg-[#454545]/5 hover:border-[#43C77A] transition-all"
        >
            {selectedValue || label}
            <ChevronDown 
            size={18} 
            className={`text-[#454545]/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
            />
        </button>

        {isOpen && (
            <div className={`absolute right-0 mt-2 ${width} bg-white border border-[#454545]/15 rounded-[8px] z-50 max-h-[200px] overflow-y-auto custom-scrollbar`}>
            {options.map((option) => (
                <div
                key={option}
                className={`px-4 py-2 text-[14px] cursor-pointer hover:bg-[#43C77A]/15 transition-colors
                    ${option === selectedValue ? "text-[#29A95E] bg-[#43C77A]/15 font-bold" : "text-[#454545]"}
                `}
                onClick={() => {
                    onSelect(option);
                    setIsOpen(false);
                }}
                >
                {option}
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default FilterDropdown;