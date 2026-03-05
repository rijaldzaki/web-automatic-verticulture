"use client";
import React, { useState } from 'react';
import PotModal from '../../components/PotModal';
// [TAMBAH] Import useMqttData untuk data real-time
import { useMqttData } from '@/hooks/useMqttData';

// [HAPUS] useMemo dummy data — diganti dengan data MQTT

const ALL_POT_IDS = Array.from({ length: 54 }, (_, i) => `POT-${(i + 1).toString().padStart(2, '0')}`);

export default function MonitoringPage() {
    const [selectedPotId, setSelectedPotId] = useState<string | null>(null);

    // [TAMBAH] Ambil data real-time dari backend WebSocket
    const { pots } = useMqttData();

    return (
        <div className="col-span-8 flex flex-col p-16 pl-8 py-8 h-full w-full">
            <div className="max-w-screen mx-auto w-full flex flex-col gap-4">
                <div className="grid grid-cols-12">
                    <div className="col-span-9 flex flex-col">
                        {[...Array(6)].map((_, rowIndex) => {
                            const isGroupEnd = (rowIndex + 1) % 2 === 0 && rowIndex !== 5;
                            return (
                                <div
                                    key={rowIndex}
                                    className={`relative flex items-center w-full h-20 ${isGroupEnd ? 'mb-12' : ''}`}
                                >
                                    <div
                                        className="absolute bg-[#1E293B] z-0 rounded-full"
                                        style={{
                                            height: '6px',
                                            left: 'calc(100% / 18)',
                                            right: 'calc(100% / 18)',
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                    />
                                    {ALL_POT_IDS.slice(rowIndex * 9, (rowIndex + 1) * 9).map((potId) => {
                                        // [UBAH] Cek status online dari data MQTT
                                        const isOnline = pots[potId]?.online ?? false;
                                        return (
                                            <div
                                                key={potId}
                                                className="z-10 flex justify-center items-center"
                                                style={{ width: 'calc(100% / 9)' }}
                                            >
                                                <button
                                                    onClick={() => setSelectedPotId(potId)}
                                                    className="group relative"
                                                >
                                                    {/* [UBAH] Warna border: hijau = online, merah = offline/belum ada data */}
                                                    <div className={`w-12 h-12 rounded-full bg-white border-4 shadow-lg flex items-center justify-center group-hover:scale-125 transition-all duration-200
                                                        ${isOnline
                                                            ? 'border-[#10B981] group-hover:bg-[#10B981] group-hover:border-white'
                                                            : 'border-[#94A3B8] group-hover:bg-[#94A3B8] group-hover:border-white'
                                                        }`}
                                                    >
                                                        <span className="text-[14px] font-bold text-[#1E293B] group-hover:text-white">
                                                            {potId.split('-')[1]}
                                                        </span>
                                                    </div>
                                                    {/* [TAMBAH] Dot indikator online di pojok kanan atas */}
                                                    {isOnline && (
                                                        <span className="absolute top-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full" />
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    {/* NOTES & COMPASS — tidak diubah */}
                    <div className="col-span-3 flex items-center justify-start gap-12 pl-4">
                        <div className="flex flex-col">
                            {[...Array(6)].map((_, rowIndex) => {
                                const isGroupEnd = (rowIndex + 1) % 2 === 0 && rowIndex !== 5;
                                return (
                                    <div key={rowIndex} className={`h-20 flex items-center ${isGroupEnd ? 'mb-12' : ''}`}>
                                        <span className="text-[14px] font-bold text-[#1E293B]/60 uppercase tracking-widest whitespace-nowrap">
                                            Row {rowIndex + 1}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-center ml-4">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <div className="absolute w-full h-[2px] bg-[#1E293B]/10"></div>
                                <div className="absolute h-full w-[2px] bg-[#1E293B]/10"></div>
                                <div className="absolute w-24 h-24 border border-[#1E293B]/10 rounded-full shadow-inner"></div>
                                <span className="absolute -left-6 font-bold text-[#1E293B] text-xl text-center w-6">U</span>
                                <span className="absolute -right-6 font-semibold text-[#1E293B]/40 text-lg text-center w-6">T</span>
                                <span className="absolute -top-7 font-semibold text-[#1E293B]/40 text-lg text-center w-6">B</span>
                                <span className="absolute -bottom-7 font-semibold text-[#1E293B]/40 text-lg text-center w-6">S</span>
                                <div className="w-1.5 h-20 bg-gradient-to-b from-[#3B82F6] via-[#3B82F6]/50 to-[#1E293B]/10 rounded-full rotate-90 shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* [UBAH] Teruskan data MQTT ke PotModal, bukan data dummy */}
            {selectedPotId && (
                <PotModal
                    pot={pots[selectedPotId] ?? null}
                    onClose={() => setSelectedPotId(null)}
                />
            )}
        </div>
    );
}