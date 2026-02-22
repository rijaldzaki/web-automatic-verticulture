"use client";

import React, { createContext, useContext, useState } from "react";
import { subMinutes } from "date-fns";

type Range = [Date, Date];

type TimeRangeContextType = {
    range: Range;
    setRange: (range: Range) => void;
};

const TimeRangeContext = createContext<TimeRangeContextType | undefined>(
    undefined
);

export function TimeRangeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Default awal: Last 5 minutes
    const [range, setRange] = useState<Range>([
        subMinutes(new Date(), 5), 
        new Date()
    ]);

    // Kita hapus variabel 'label' dari sini. 
    // Kenapa? Karena logika "Last 5 Minutes" dsb lebih tepat dihitung 
    // di komponen UI agar Context tetap ringan dan hanya fokus pada data (state).

    return (
        <TimeRangeContext.Provider value={{ range, setRange }}>
            {children}
        </TimeRangeContext.Provider>
    );
}

export function useTimeRange() {
    const context = useContext(TimeRangeContext);
    if (!context) {
        throw new Error("useTimeRange must be used inside TimeRangeProvider");
    }
    return context;
}