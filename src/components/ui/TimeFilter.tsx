"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    format,
    subMinutes,
    subHours,
    subDays,
    isAfter,
} from "date-fns";

import { Clock, ChevronDown, RotateCcw, Calendar } from "lucide-react";
import { useTimeRange } from "../../hooks/useTimeRange";

const clampNow = (d: Date) => {
    const now = new Date();
    return isAfter(d, now) ? now : d;
};

export default function TimeFilter() {
    const { range, setRange, label } = useTimeRange();

    const [isOpen, setIsOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [tempRange, setTempRange] = useState<[Date, Date]>(range);

    const popupRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});

    useLayoutEffect(() => {
        if (!calendarOpen) return;
        const p = popupRef.current;
        const c = calendarRef.current;
        if (!p || !c) return;

        const pr = p.getBoundingClientRect();
        const cr = c.getBoundingClientRect();

        let left = -cr.width - 8;
        let top = 0;

        if (pr.left + left < 0) left = pr.width + 8;
        if (pr.top + cr.height > window.innerHeight)
            top = pr.height - cr.height;
        if (top < 0) top = 0;

        setStyle({ position: "absolute", left, top, zIndex: 60 });
    }, [calendarOpen]);

    const quick = [
        { label: "Last 5 minutes", v: () => [subMinutes(new Date(), 5), new Date()] },
        { label: "Last 15 minutes", v: () => [subMinutes(new Date(), 15), new Date()] },
        { label: "Last 30 minutes", v: () => [subMinutes(new Date(), 30), new Date()] },
        { label: "Last 1 hour", v: () => [subHours(new Date(), 1), new Date()] },
        { label: "Last 12 hours", v: () => [subHours(new Date(), 12), new Date()] },
        { label: "Last 24 hours", v: () => [subHours(new Date(), 24), new Date()] },
        { label: "Last 3 days", v: () => [subDays(new Date(), 3), new Date()] },
        { label: "Last 7 days", v: () => [subDays(new Date(), 7), new Date()] },
    ];

    const update = (val: string, index: number) => {
        const d = new Date(val.replace(" ", "T"));
        if (!isNaN(d.getTime())) {
            const newRange: [Date, Date] = [...tempRange];
            newRange[index] = clampNow(d);
            setTempRange(newRange);
        }
    };

    const apply = () => {
        setRange([clampNow(tempRange[0]), clampNow(tempRange[1])], null);
        setIsOpen(false);
        setCalendarOpen(false);
    };

    const reset = () => {
        const r = quick[0].v() as [Date, Date];
        setTempRange(r);
        setRange(r, quick[0].label);
        setIsOpen(false);
        setCalendarOpen(false);
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 bg-white border rounded text-[14px]"
            >
                <Clock size={14} />
                <span>{label}</span>
                <ChevronDown size={18} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    <div
                        ref={popupRef}
                        className="absolute right-0 mt-2 z-50 bg-white shadow-2xl rounded border w-[420px]"
                    >
                        <div className="p-4">
                            <p className="text-[11px] mb-1">FROM</p>
                            <div className="flex mb-3">
                                <input
                                    value={format(tempRange[0], "yyyy-MM-dd HH:mm")}
                                    onChange={(e) => update(e.target.value, 0)}
                                    className="flex-1 border rounded-l px-2 py-1 text-[13px]"
                                />
                                <button
                                    onClick={() => setCalendarOpen((v) => !v)}
                                    className="px-2 border border-l-0 bg-gray-50 rounded-r"
                                >
                                    <Calendar size={16} />
                                </button>
                            </div>

                            <p className="text-[11px] mb-1">TO</p>
                            <div className="flex mb-4">
                                <input
                                    value={format(tempRange[1], "yyyy-MM-dd HH:mm")}
                                    onChange={(e) => update(e.target.value, 1)}
                                    className="flex-1 border rounded-l px-2 py-1 text-[13px]"
                                />
                                <button
                                    onClick={() => setCalendarOpen((v) => !v)}
                                    className="px-2 border border-l-0 bg-gray-50 rounded-r"
                                >
                                    <Calendar size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-1">
                                {quick.map((q) => (
                                    <button
                                        key={q.label}
                                        onClick={() => {
                                            const r = q.v() as [Date, Date];
                                            setTempRange(r);
                                            setRange(r, q.label);
                                            setIsOpen(false);
                                        }}
                                        className="text-left px-2 py-1 text-[12px] rounded hover:bg-[#43C77A]/15"
                                    >
                                        {q.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="px-4 py-2 bg-gray-50 border-t flex justify-between">
                            <button
                                onClick={reset}
                                className="flex items-center gap-1 text-[12px] px-2 py-1 bg-[#454545]/50 text-white rounded"
                            >
                                <RotateCcw size={14} /> Reset
                            </button>

                            <button
                                onClick={apply}
                                className="px-4 py-1.5 bg-[#29A95E] text-white rounded text-[12px]"
                            >
                                Apply
                            </button>
                        </div>

                        {calendarOpen && (
                            <div
                                ref={calendarRef}
                                style={style}
                                className="bg-white border rounded shadow-xl p-3"
                            >
                                <DatePicker
                                    selectsRange
                                    inline
                                    showTimeSelect
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    startDate={tempRange[0]}
                                    endDate={tempRange[1]}
                                    maxDate={new Date()}
                                    timeIntervals={1}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    minTime={new Date(0, 0, 0, 0, 0)}
                                    maxTime={
                                        tempRange[1] &&
                                        tempRange[1].toDateString() === new Date().toDateString()
                                            ? new Date()
                                            : new Date(0, 0, 0, 23, 59)
                                    }
                                    onChange={(update) => {
                                        if (!Array.isArray(update)) return;
                                        const [start, end] = update;
                                        if (!start) return;

                                        setTempRange([
                                            clampNow(start),
                                            end ? clampNow(end) : tempRange[1],
                                        ]);
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
