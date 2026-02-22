"use client";
import React, { useState, useRef, useLayoutEffect, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { format, subMinutes, subHours, subDays, isAfter, differenceInSeconds, getMonth, getYear, startOfToday } from "date-fns";
import { Clock, ChevronDown, RotateCcw, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useTimeRange } from "@/hooks/useTimeRange";

const clampNow = (d: Date) => {
    const now = new Date();
    return isAfter(d, now) ? now : d;
};

const startDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};

const endDay = (d: Date) => {
    const x = new Date(d);
    const now = new Date();
    x.setHours(23, 59, 59, 999);
    return isAfter(x, now) ? now : x;
};

export default function TimeFilter() {
    const { range, setRange } = useTimeRange();
    const [isOpen, setIsOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [tempRange, setTempRange] = useState<[Date, Date | null]>([range[0], range[1]]);
    
    const [viewMode, setViewMode] = useState<"days" | "months" | "years">("days");
    // Default ke hari ini
    const [pickerDate, setPickerDate] = useState<Date>(new Date());

    const popupRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

    const quick = useMemo(() => [
        { label: "Last 5 minutes", v: () => [subMinutes(new Date(), 5), new Date()] },
        { label: "Last 15 minutes", v: () => [subMinutes(new Date(), 15), new Date()] },
        { label: "Last 30 minutes", v: () => [subMinutes(new Date(), 30), new Date()] },
        { label: "Last 1 hour", v: () => [subHours(new Date(), 1), new Date()] },
        { label: "Last 12 hours", v: () => [subHours(new Date(), 12), new Date()] },
        { label: "Last 24 hours", v: () => [subHours(new Date(), 24), new Date()] },
        { label: "Last 3 days", v: () => [subDays(new Date(), 3), new Date()] },
        { label: "Last 7 days", v: () => [subDays(new Date(), 7), new Date()] },
    ], []);

    // RESET LOGIC: Setiap kali popup utama dibuka, kembalikan posisi kalender ke "Now"
    useEffect(() => {
        if (isOpen) {
            setPickerDate(new Date());
            setViewMode("days");
        }
    }, [isOpen]);

    const displayLabel = useMemo(() => {
        const match = quick.find(q => {
            const [qs] = q.v();
            return Math.abs(differenceInSeconds(range[0], qs)) < 5;
        });
        if (match) return match.label;
        return `${format(range[0], "dd MMM HH:mm")} - ${format(range[1], "dd MMM HH:mm")}`;
    }, [range, quick]);

    useLayoutEffect(() => {
        if (!calendarOpen) return;
        const updatePos = () => {
            const p = popupRef.current;
            const c = calendarRef.current;
            if (!p || !c) return;
            const pr = p.getBoundingClientRect();
            const calWidth = 300; 
            let left = -calWidth - 10;
            if (pr.left + left < 0) left = pr.width + 10;
            setStyle({ position: "absolute", left, top: 0, zIndex: 100, opacity: 1, display: 'block' });
        };
        updatePos();
        const t = setTimeout(updatePos, 30);
        return () => clearTimeout(t);
    }, [calendarOpen]);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handleReset = () => {
        const r = quick[3].v() as [Date, Date]; // Default ke Last 1 Hour
        setRange(r);
        setTempRange(r);
        setPickerDate(new Date()); // Reset posisi kalender ke Now
        setViewMode("days");
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#454545]/20 rounded text-[14px] hover:border-[#43C77A] transition-all">
                <Clock size={14} className="text-[#454545]/60" />
                <span className="font-semibold text-[#454545]">{displayLabel}</span>
                <ChevronDown size={16} className="text-[#454545]/40" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => {setIsOpen(false); setCalendarOpen(false);}} />
                    <div ref={popupRef} className="absolute right-0 mt-2 z-50 bg-white shadow-2xl rounded-lg border w-[420px]">
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {(["From", "To"] as const).map((label, i) => (
                                    <div key={label}>
                                        <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">{label}</p>
                                        <div className="flex">
                                            <input
                                                readOnly
                                                value={tempRange[i] ? format(tempRange[i]!, "yyyy-MM-dd HH:mm") : ""}
                                                className="w-full border rounded-l px-2 py-1.5 text-[12px] bg-gray-50 cursor-default focus:outline-none"
                                            />
                                            <button onClick={() => {
                                                setCalendarOpen(true); 
                                                // Saat buka kalender via icon, pastikan ke mode 'days' dan ke bulan yang relevan
                                                setViewMode("days");
                                                if(tempRange[i]) setPickerDate(tempRange[i]!);
                                            }} className="px-2 border border-l-0 bg-gray-50 rounded-r hover:bg-gray-100">
                                                <Calendar size={14} className="text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 border-t pt-4">
                                {quick.map(q => (
                                    <button key={q.label} onClick={() => {
                                        const r = q.v() as [Date, Date];
                                        setRange(r);
                                        setTempRange(r);
                                        setIsOpen(false); 
                                        setCalendarOpen(false);
                                    }} className="text-left px-3 py-1.5 text-[12px] text-gray-600 rounded hover:bg-[#43C77A]/10 hover:text-[#29A95E]">
                                        {q.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="px-4 py-3 bg-gray-50 border-t rounded-b-lg flex justify-end gap-2">
                             <button onClick={handleReset} className="text-[12px] text-gray-500 flex items-center gap-1 hover:text-gray-700">
                                 <RotateCcw size={14}/> Reset
                             </button>
                             <button onClick={() => {
                                 if(tempRange[0] && tempRange[1]) {
                                     setRange([tempRange[0], tempRange[1]]);
                                     setIsOpen(false);
                                     setCalendarOpen(false);
                                 }
                             }} className="px-6 py-1.5 bg-[#29A95E] text-white rounded text-[12px] font-bold hover:bg-[#238c4f]">
                                 Apply Range
                             </button>
                        </div>

                        {calendarOpen && (
                            <div ref={calendarRef} style={style} className="bg-white border rounded-lg shadow-2xl p-2 w-[300px]">
                                <DatePicker
                                    selected={tempRange[0]}
                                    startDate={tempRange[0]}
                                    endDate={tempRange[1]}
                                    onChange={(update) => {
                                        const [s, e] = update as [Date, Date | null];
                                        const finalS = s ? clampNow(startDay(s)) : tempRange[0];
                                        const finalE = e ? clampNow(endDay(e)) : null;
                                        setTempRange([finalS, finalE]);
                                        if (s && e) {
                                            setCalendarOpen(false);
                                            setViewMode("days");
                                        }
                                    }}
                                    selectsRange
                                    inline
                                    maxDate={new Date()}
                                    // openToDate sangat penting untuk "memaksa" tampilan ke tanggal tertentu
                                    openToDate={pickerDate} 
                                    showMonthYearPicker={viewMode === "months"}
                                    showYearPicker={viewMode === "years"}
                                    renderCustomHeader={({ date, changeMonth, changeYear, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                                        <div className="flex items-center justify-between px-2 py-1">
                                            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}><ChevronLeft size={16}/></button>
                                            <div className="flex gap-1 font-bold text-[14px]">
                                                <span className="cursor-pointer hover:text-blue-600 transition-colors" 
                                                    onClick={() => setViewMode(viewMode === "months" ? "days" : "months")}>
                                                    {months[getMonth(date)]}
                                                </span>
                                                <span className="cursor-pointer hover:text-blue-600 transition-colors" 
                                                    onClick={() => setViewMode(viewMode === "years" ? "days" : "years")}>
                                                    {getYear(date)}
                                                </span>
                                            </div>
                                            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}><ChevronRight size={16}/></button>
                                        </div>
                                    )}
                                    onMonthChange={(date) => {
                                        setPickerDate(date);
                                        if(viewMode === "months") setViewMode("days");
                                    }}
                                    onYearChange={(date) => {
                                        setPickerDate(date);
                                        if(viewMode === "years") setViewMode("days");
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}