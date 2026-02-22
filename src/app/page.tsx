"use client";

import { useState } from "react";
import FilterDropdown from "../components/ui/FilterDropdown";
import Dummychart from "../components/Dummychart";
import Card from "../components/ui/Card";
import { useRouter } from "next/navigation";
import { Thermometer, Wind, Sun, CloudRain, Bell, Cpu, Circle, CircleOff } from "lucide-react";

export default function Home() {
  const [selectedPot, setSelectedPot] = useState("POT 1");
  const [selectedVar, setSelectedVar] = useState("Temperature");
  const router = useRouter();

  // Data dummy filter options
  const potOptions = Array.from({ length: 54 }, (_, i) => `POT ${i + 1}`);
  const varOptions = ["Temperature", "Soil Moisture", "Water Level", "Water Flow", "Valve Status"];

  return (

    <div className="grid grid-cols-12 gap-[15px]">

      {/* LEFT AREA */}
      <div className="col-span-8 flex flex-col gap-[15px]">

        {/* WEATHER */}
        <div className="grid grid-cols-4 gap-[15px] h-[180px]">

          <Card 
            hover
            onClick={()=>router.push("/weather?tab=temperature")}
            className="w-full flex flex-col justify-between p-[12px]"
          >
            <div className="flex flex-col items-start">
                <Thermometer size={25} />
                <p className="mt-[2px] text-[14px] font-medium">Temperature</p>
            </div>
            <div className="flex justify-between items-end w-full">
                <div className="flex items-baseline leading-none">
                  <p className="text-[48px] font-regular tracking-tighter">20</p>
                  <p className="text-[30px] font-light tracking-tighter ml-0.5">°C</p>
                </div>
                <div className="bg-[#43C77A] text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium mb-1.5">
                  Good
                </div>
            </div>
          </Card>

          <Card 
            hover
            onClick={()=>router.push("/weather?tab=wind")}
            className=" w-full flex flex-col justify-between p-[12px]"
          >
            <div className="flex flex-col items-start">
                <Wind size={25} />
                <p className="mt-[2px] text-[14px] font-medium">Wind</p>
            </div>
            <div className="flex justify-between items-end w-full">
                <div className="flex items-baseline leading-none">
                  <p className="text-[48px] font-regular tracking-tighter">2</p>
                  <p className="text-[30px] font-light tracking-tighter ml-0.5">m/s</p>
                </div>
                <div className="bg-[#43C77A] text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium mb-1.5">
                  Good
                </div>
            </div>
          </Card>

          <Card 
            hover
            onClick={()=>router.push("/weather?tab=uv")}
            className=" w-full flex flex-col justify-between p-[12px]"
          >
            <div className="flex flex-col items-start">
                <Sun size={25} />
                <p className="mt-[2px] text-[14px] font-medium">UV</p>
            </div>
            <div className="flex justify-between items-end w-full">
                <div className="flex items-baseline leading-none">
                  <p className="text-[48px] font-regular tracking-tighter">10</p>
                  <p className="text-[30px] font-light tracking-tighter ml-0.5"></p>
                </div>
                <div className="bg-[#F33A3A] text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium mb-1.5">
                  Bad
                </div>
            </div>
          </Card>

          <Card 
            hover
            onClick={()=>router.push("/weather?tab=rainfall")}
            className=" w-full flex flex-col justify-between p-[12px]"
          >
            <div className="flex flex-col items-start">
                <CloudRain size={25} />
                <p className="mt-[2px] text-[14px] font-medium">Rainfall</p>
            </div>
            <div className="flex justify-between items-end w-full">
                <div className="flex items-baseline leading-none">
                  <p className="text-[48px] font-regular tracking-tighter">10</p>
                  <p className="text-[30px] font-light tracking-tighter ml-0.5">mm</p>
                </div>
                <div className="bg-[#43C77A] text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium mb-1.5">
                  Good
                </div>
            </div>
          </Card>

        </div>

        {/* DEVICE */}
        <div className="grid grid-cols-3 gap-[15px] h-[140px]">

          <Card 
            onClick={()=>router.push("/devices")}
            className=" w-full flex flex-col justify-between p-[20px]"
          >
            <div className="flex justify-between items-end w-full">
              <p className="font-medium text-[14px]">Total Devices</p>
              <Cpu size={30}/>
            </div>
            <div className="flex items-baseline leading-none">
              <p className="text-[40px] text-[#29A95E] font-regular tracking-tighter">54</p>
              <p className="text-[14px] font-regular ml-[12px]">Installed</p>
            </div>
          </Card>

          <Card 
            onClick={()=>router.push("/devices")}
            className=" w-full flex flex-col justify-between p-[20px]"
          >
            <div className="flex justify-between items-end w-full">
              <p className="font-medium text-[14px]">Active Devices</p>
              <Circle size={30}/>
            </div>
            <div className="flex items-baseline leading-none">
              <p className="text-[40px] text-[#29A95E] font-regular tracking-tighter">50</p>
              <p className="text-[14px] font-regular ml-[12px]">Operating</p>
            </div>
          </Card>

          <Card 
            onClick={()=>router.push("/devices")}
            className=" w-full flex flex-col justify-between p-[20px]"
          >
            <div className="flex justify-between items-end w-full">
              <p className="font-medium text-[14px]">Inactive Devices</p>
              <CircleOff size={30}/>
            </div>
            <div className="flex items-baseline leading-none">
              <p className="text-[40px] text-[#29A95E] font-regular tracking-tighter">4</p>
              <p className="text-[14px] font-regular ml-[12px]">Offline</p>
            </div>
          </Card>

        </div>

        {/* CHART */}
        <Card className="h-[320px] p-[20px] flex flex-col">
          <div className="flex justify-end gap-3">
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
          {/* 1. Header Filter */}
          <div className="flex justify-end gap-3 mb-4">
            {/* Dropdown filters */}
          </div>

          {/* 2. Area Tengah (Chart + Label Y) */}
          <div className="flex-1 flex relative">
            {/* Label Y: Sekarang kita pakai koordinat yang lebih aman */}
            <div className="absolute left-[-40px] top-1/2 -rotate-90 origin-center text-[12px] font-medium text-gray-500">
              Temperature (°C)
            </div>

            {/* Chart: Berikan ml-6 agar tidak menabrak label Y */}
            <div className="flex-1 ml-6 overflow-hidden">
              <Dummychart />
            </div>
          </div>

          {/* 3. Label X: Berikan mt agar ada jarak dari chart */}
          <div className="mt-2 text-center text-[12px] font-medium text-gray-500">
            Time
          </div>
        </Card>
      </div>

      {/* RIGHT AREA */}
      <div className="col-span-4">

        <Card className="h-full p-[20px] gap-[15px] flex flex-col">

          <div className="flex items-center gap-2 mb-4">
            <Bell size={25}/>
            <p className="font-medium text-[14px]">Notifications</p>
          </div>

          <div className="space-y-3 text-[14px]">

            <div className="bg-[#F1F3F5] rounded-xl p-4 flex flex-col gap-1 relative">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-400 mb-1" />
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-800 text-[15px]">POT 2</h4>
                <span className="text-gray-400 text-[13px]">2m</span>
              </div>
              <p className="text-gray-500 text-[14px] leading-tight">
                ESP32 Restarting
              </p>
            </div>

            <div className="bg-[#F1F3F5] rounded-xl p-4 flex flex-col gap-1 relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 mb-1" />
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-800 text-[15px]">POT 12</h4>
                <span className="text-gray-400 text-[13px]">4m</span>
              </div>
              <p className="text-gray-500 text-[14px] leading-tight">
                ESP32 Connecting
              </p>
            </div>

            <div className="bg-[#F1F3F5] rounded-xl p-4 flex flex-col gap-1 relative">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 mb-1" />
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-800 text-[15px]">POT 4</h4>
                <span className="text-gray-400 text-[13px]">4m</span>
              </div>
              <p className="text-gray-500 text-[14px] leading-tight">
                [ERROR] Sensor Reading Failed 
              </p>
            </div>

          </div>

        </Card>

      </div>

    </div>

  );
}
