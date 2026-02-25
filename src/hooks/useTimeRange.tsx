"use client";

import React, { createContext, useContext, useState } from "react";
import { format } from "date-fns";

type Range = [Date, Date];

type TimeRangeContextType = {
    range: Range;
    setRange: (range: Range, quickLabel?: string | null) => void;
    label: string;
};

const TimeRangeContext = createContext<TimeRangeContextType | undefined>(
    undefined
);

export const TimeRangeProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const now = new Date();
    const defaultRange: Range = [new Date(now.getTime() - 5 * 60000), now];

    const [range, setRangeState] = useState<Range>(defaultRange);
    const [quickLabel, setQuickLabel] = useState<string | null>("Last 5 minutes");

    const setRange = (newRange: Range, label?: string | null) => {
        setRangeState(newRange);
        setQuickLabel(label ?? null);
    };

    const label =
        quickLabel ??
        `${format(range[0], "yyyy-MM-dd HH:mm")} - ${format(
        range[1],
        "yyyy-MM-dd HH:mm"
    )}`;

    return (
        <TimeRangeContext.Provider value={{ range, setRange, label }}>
        {children}
        </TimeRangeContext.Provider>
    );
};

export const useTimeRange = () => {
    const ctx = useContext(TimeRangeContext);
    if (!ctx) throw new Error("useTimeRange must be used inside provider");
    return ctx;
    };