"use client";
import { useState, useEffect, useRef } from "react";

const BACKEND_WS_URL = process.env.NEXT_PUBLIC_BACKEND_WS_URL || "ws://localhost:3001";

export interface PotData {
    id: string;
    temperature1: number;
    temperature2: number;
    humidity1: number;
    humidity2: number;
    waterLevel: number;
    waterFlow: number;
    valveStatus: "Open" | "Closed";
    online: boolean;
    lastUpdated: string;
}

export interface RawDataPoint {
    timestamp: number;
    time: string;
    date: string;
    fullDate: string;
    temperature1: number;
    temperature2: number;
    humidity1: number;
    humidity2: number;
    waterLevel: number;
    waterFlow: number;
    valveStatus: number;
}

export function useMqttData() {
    const [connected, setConnected] = useState(false);
    const [pots, setPots] = useState<Record<string, PotData>>({});
    const [history, setHistory] = useState<Record<string, RawDataPoint[]>>({});
    // [FIX] Gunakan useRef untuk menyimpan ws, bukan useState
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // [FIX] Flag untuk cegah setState setelah unmount
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        function connect() {
            // [FIX] Guard: jangan jalankan di server (SSR)
            if (typeof window === "undefined") return;

            // Bersihkan koneksi sebelumnya jika ada
            if (wsRef.current) {
                wsRef.current.onclose = null; // cegah auto-reconnect saat cleanup manual
                wsRef.current.close();
            }

            const ws = new WebSocket(BACKEND_WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                if (!isMounted.current) return;
                setConnected(true);
                console.log("✅ Connected to backend WebSocket");
                // Bersihkan timer reconnect jika berhasil connect
                if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            };

            ws.onclose = () => {
                if (!isMounted.current) return;
                setConnected(false);
                console.log("🔴 WS disconnected, retry in 3s...");
                reconnectTimer.current = setTimeout(connect, 3001);
            };

            ws.onerror = (err) => {
                console.error("WebSocket error:", err);
                ws.close(); // trigger onclose → auto reconnect
            };

            ws.onmessage = (event) => {
                if (!isMounted.current) return;
                try {
                    const msg = JSON.parse(event.data);

                    if (msg.type === "snapshot") {
                        setPots(msg.pots ?? {});
                        setHistory(msg.history ?? {});
                        return;
                    }

                    if (msg.type === "status") {
                        setPots((prev) => ({
                            ...prev,
                            [msg.potId]: {
                                ...(prev[msg.potId] ?? defaultPot(msg.potId)),
                                online: msg.online,
                            },
                        }));
                        return;
                    }

                    if (msg.type === "data") {
                        const { potId, payload, point } = msg;
                        setPots((prev) => ({ ...prev, [potId]: payload }));
                        setHistory((prev) => {
                            const existing = prev[potId] ?? [];
                            return { ...prev, [potId]: [...existing, point].slice(-500) };
                        });
                    }
                } catch (e) {
                    console.error("Failed to parse WS message:", e);
                }
            };
        }

        connect();

        // [FIX] Cleanup saat komponen unmount — cegah setState & reconnect
        return () => {
            isMounted.current = false;
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            if (wsRef.current) {
                wsRef.current.onclose = null; // cegah auto-reconnect
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []); // [] — hanya sekali saat mount

    return { connected, pots, history };
}

function defaultPot(id: string): PotData {
    return {
        id,
        temperature1: 0, temperature2: 0,
        humidity1: 0, humidity2: 0,
        waterLevel: 0, waterFlow: 0,
        valveStatus: "Closed",
        online: false,
        lastUpdated: new Date().toISOString(),
    };
}