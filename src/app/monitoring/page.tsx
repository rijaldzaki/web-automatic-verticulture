"use client";
import React, { useState, useMemo } from 'react';
import PotModal from '../../components/PotModal';

export default function MonitoringPage() {
    const [selectedPot, setSelectedPot] = useState<any | null>(null);

    const pots = useMemo(() => {
        return Array.from({ length: 54 }, (_, i) => ({
            id: `POT-${(i + 1).toString().padStart(2, '0')}`,
            temperature1: 25 + Math.floor(Math.random() * 5),
            temperature2: 25 + Math.floor(Math.random() * 5),
            humidity1: 60 + Math.floor(Math.random() * 20),
            humidity2: 60 + Math.floor(Math.random() * 20),
            waterLevel: 80,
            waterFlow: 2.5,
            valveStatus: Math.random() > 0.5 ? 'Open' : 'Closed'
        }));
    }, []);

    return (
        <div className="col-span-8 flex flex-col p-16 pl-8 py-8 h-full w-full">
            <div className="max-w-screen mx-auto w-full flex flex-col gap-4">
                <div className="grid grid-cols-12 ">
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
                                    {pots.slice(rowIndex * 9, (rowIndex + 1) * 9).map((pot) => (
                                        <div 
                                            key={pot.id} 
                                            className="z-10 flex justify-center items-center"
                                            style={{ width: 'calc(100% / 9)' }}
                                        >
                                            <button
                                                onClick={() => setSelectedPot(pot)}
                                                className="group relative"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-white border-4 border-[#10B981] shadow-lg flex items-center justify-center group-hover:scale-125 group-hover:bg-[#10B981] group-hover:border-white transition-all duration-200">
                                                    <span className="text-[14px] font-bold text-[#1E293B] group-hover:text-white">
                                                        {pot.id.split('-')[1]}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    {/* NOTES & COMPASS CONTAINER */}
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

            {selectedPot && (
                <PotModal 
                    pot={selectedPot} 
                    onClose={() => setSelectedPot(null)} 
                />
            )}
        </div>
    );
}