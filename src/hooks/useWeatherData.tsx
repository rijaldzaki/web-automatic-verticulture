"use client";

import { useMemo } from "react";

export interface WeatherValues {
    temperatureout: number;
    wind: number;
    uv: number;
    rainfall: number;
}

export function useWeatherData(): WeatherValues {
    const data = useMemo(() => {
        const now = new Date().getTime();

        const baseConfig = {
            temperatureout: 28,
            wind: 4,
            uv: 5,
            rainfall: 0.2
        };

        const generateValue = (base: number) =>
            Number((base + Math.sin(now / 10000000) * 2 + Math.random()).toFixed(1));

        return {
            temperatureout: generateValue(baseConfig.temperatureout),
            wind: generateValue(baseConfig.wind),
            uv: generateValue(baseConfig.uv),
            rainfall: generateValue(baseConfig.rainfall)
        };
    }, []);

    return data;
}
