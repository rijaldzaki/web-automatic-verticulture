"use client";

import { useState } from "react";
import FilterDropdown from "../components/ui/FilterDropdown";
import Dummychart from "../components/Dummychart";
import Card from "../components/ui/Card";
import { useRouter } from "next/navigation";
import { PiThermometerBold } from "react-icons/pi";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { FiWind } from "react-icons/fi";
import { MdSunny } from "react-icons/md";
import { BsFillCloudRainFill } from "react-icons/bs";

export default function Home() {
  const [selectedPot, setSelectedPot] = useState("POT 1");
  const [selectedVar, setSelectedVar] = useState("Temperature");
  const router = useRouter();

  const potOptions = Array.from({ length: 54 }, (_, i) => `POT ${i + 1}`);
  const varOptions = ["Temperature", "Soil Moisture", "Water Level", "Water Flow", "Valve Status"];

  return (
    <div className="col-span-8 flex flex-col gap-8 p-8 px-16 h-full">
      
      {/* SECTION: WEATHER (4 Columns) */}
      <div className="grid grid-cols-4 gap-8 min-h-[120px]">
        <WeatherHomeCard 
          label="Temperature"
          value="20"
          unit="°C"
          icon={<PiThermometerBold size={24} />}
          onRoute={() => router.push("/weather?tab=temperature")}
        />

        <WeatherHomeCard 
          label="Wind"
          value="2"
          unit="m/s"
          icon={<FiWind size={24} />}
          onRoute={() => router.push("/weather?tab=wind")}
        />

        <WeatherHomeCard 
          label="UV"
          value="10"
          unit=""
          icon={<MdSunny size={24} />}
          onRoute={() => router.push("/weather?tab=uv")}
        />

        <WeatherHomeCard 
          label="Rainfall"
          value="10"
          unit="mm"
          icon={<BsFillCloudRainFill size={24} />}
          onRoute={() => router.push("/weather?tab=rainfall")}
        />
      </div>

      {/* SECTION: DEVICE SUMMARY (3 Columns) */}
      <div className="grid grid-cols-3 gap-8 min-h-[100px]">
        <DeviceStatusCard 
          label="Total Devices"
          value="54"
          subLabel="Installed"
          variant="green"
        />
        <DeviceStatusCard 
          label="Active Devices"
          value="50"
          subLabel="Operating"
          variant="green"
        />
        <DeviceStatusCard 
          label="Inactive Devices"
          value="4"
          subLabel="Offline"
          variant="red"
          onClick={() => router.push("/devices")}
        />
      </div>

      {/* SECTION: CHART */}
      <Card className="bg-white p-[20px] flex flex-col shadow-sm border border-slate-100">
        <div className="flex justify-end gap-3 mb-6">
          <FilterDropdown 
            label="Select POT"
            options={potOptions}
            selectedValue={selectedPot}
            onSelect={setSelectedPot}
          />
          <FilterDropdown 
            label="Select Variable"
            options={varOptions}
            selectedValue={selectedVar}
            onSelect={setSelectedVar}
            width="w-44"
          />
        </div>

        <div className="flex-1 flex relative">
          <div className="absolute left-[-45px] top-1/2 -rotate-90 origin-center text-[12px] font-bold text-[#1E293B]/40 uppercase tracking-widest">
            {selectedVar}
          </div>

          <div className="flex-1 ml-6 overflow-hidden">
            <Dummychart />
          </div>
        </div>

        <div className="mt-4 text-center text-[12px] font-bold text-[#1E293B]/40 uppercase tracking-widest">
          Time Execution
        </div>
      </Card>
    </div>
  );
}

/** * SUB-COMPONENT: WeatherHomeCard
 * Digunakan untuk 4 card weather di baris pertama
 */
function WeatherHomeCard({ label, value, unit, icon, onRoute }: any) {
  return (
    <Card className="w-full grid grid-cols-1 justify-between bg-white border border-slate-50">
      <div className="flex justify-between items-start w-full">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-[#10B981]">{icon}</div>
          <p className="text-[12px] text-[#1E293B]/60 font-bold uppercase tracking-wide">{label}</p>
        </div>
        <FaArrowUpRightFromSquare
          onClick={onRoute}
          size={20} 
          className="text-[#1E293B]/30 hover:text-[#10B981] cursor-pointer transition-all transform hover:scale-110"
        />
      </div>
      <div className="flex items-baseline leading-none items-end w-full mt-2">
        <div className="text-4xl font-bold tracking-tighter text-[#1E293B]">{value}</div>
        {unit && (
          <p className="text-2xl text-[#1E293B]/40 font-bold ml-2">{unit}</p>
        )}
      </div>
    </Card>
  );
}

/** * SUB-COMPONENT: DeviceStatusCard
 * Digunakan untuk 3 card device di baris kedua
 */
function DeviceStatusCard({ label, value, subLabel, variant, onClick }: any) {
  const bgColor = variant === "green" ? "bg-[#10B981]" : "bg-[#EF4444]";
  
  return (
    <Card 
      onClick={onClick}
      className={`w-full flex flex-col justify-between font-semibold ${bgColor} text-white transition-transform active:scale-[0.98] ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="text-[12px] font-semibold tracking-wider uppercase">
        {label}
      </div>
      <div className="flex items-baseline leading-none mt-4">
        <div className="text-4xl font-bold tracking-tighter">{value}</div>
        <p className="text-lg font-bold ml-3 opacity-80">{subLabel}</p>
      </div>
    </Card>
  );
}