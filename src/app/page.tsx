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

  // Data dummy filter options
  const potOptions = Array.from({ length: 54 }, (_, i) => `POT ${i + 1}`);
  const varOptions = ["Temperature", "Soil Moisture", "Water Level", "Water Flow", "Valve Status"];

  return (
      <div className="col-span-8 flex flex-col gap-8 p-8 px-16 h-full">

        {/* WEATHER */}
        <div className="grid grid-cols-4 gap-8 min-h-[140px]">
          <Card className="w-full grid grid-cols-1 justify-between bg-white">
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col items-start gap-[4px]">
                <PiThermometerBold size={24} className="text-[#10B981]"/>
                <p className="text-[14px] text-[#1E293B]/60 font-semibold">Temperature</p>
              </div>
              <FaArrowUpRightFromSquare
              onClick={()=>router.push("/weather?tab=temperature")}
              size={24} 
              className="text-[#1E293B]/60 hover:text-[#10B981] cursor-pointer transition"
              />
            </div>
            <div className="flex items-baseline leading-none items-end w-full">
              <div className="text-[48px] font-semibold tracking-tighter">20</div>
              <p className="text-[30px] text-[#1E293B]/60 font-bold tracking-tighter ml-1">°C</p>
            </div>
          </Card>

          <Card className="w-full grid grid-cols-1 justify-between bg-white">
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col items-start gap-[4px]">
                  <FiWind size={24} className="text-[#10B981]"/>
                  <p className="text-[14px] text-[#1E293B]/60 font-semibold">Wind</p>
              </div>
              <FaArrowUpRightFromSquare
              onClick={()=>router.push("/weather?tab=wind")}
              size={24} 
              className="text-[#1E293B]/60 hover:text-[#10B981] cursor-pointer transition"
              />
            </div>
            <div className="flex items-baseline leading-none items-end w-full">
              <div className="text-[48px] font-semibold tracking-tighter">2</div>
              <p className="text-[30px] text-[#1E293B]/60 font-bold tracking-tighter ml-1">m/s</p>
            </div>
          </Card>

          <Card className="w-full grid grid-cols-1 justify-between bg-white">
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col items-start gap-[4px]">
                <MdSunny size={24} className="text-[#10B981]"/>
                <p className="text-[14px] text-[#1E293B]/60 font-semibold">UV</p>
              </div>  
              <FaArrowUpRightFromSquare
              onClick={()=>router.push("/weather?tab=uv")}
              size={24} 
              className="text-[#1E293B]/60 hover:text-[#10B981] cursor-pointer transition"
              />
            </div>
            <div className="flex items-baseline leading-none items-end w-full">
              <div className="text-[48px] font-semibold tracking-tighter">10</div>
              <p className="text-[30px] text-[#1E293B]/60 font-bold tracking-tighter ml-1"></p>
            </div>
          </Card>

          <Card className=" w-full grid grid-cols-1 justify-between bg-white">
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col items-start gap-[4px]">
                  <BsFillCloudRainFill size={24} className="text-[#10B981]"/>
                  <p className="text-[14px] text-[#1E293B]/60 font-semibold">Rainfall</p>
              </div>
              <FaArrowUpRightFromSquare
              onClick={()=>router.push("/weather?tab=rainfall")}
              size={24} 
              className="text-[#1E293B]/60 hover:text-[#10B981] cursor-pointer transition"
              />
            </div>
            <div className="flex items-baseline leading-none items-end w-full">
              <div className="text-[48px] font-semibold tracking-tighter">10</div>
              <p className="text-[30px] text-[#1E293B]/60 font-bold tracking-tighter ml-1">mm</p>
            </div>
          </Card>
        </div>

        {/* DEVICE */}
        <div className="grid grid-cols-3 gap-8 min-h-[140px]">
          <Card 
            className=" w-full flex flex-col justify-between font-semibold bg-[#10B981] text-white"
          >
            <div className="flex justify-between items-end w-full text-[14px]">
              Total Devices
            </div>
            <div className="flex items-baseline leading-none">
              <div className="text-[48px] tracking-tighter">54</div>
              <p className="text-[14px] font-bold ml-3">Installed</p>
            </div>
          </Card>

          <Card 
            className=" w-full flex flex-col justify-between font-semibold bg-[#10B981] text-white"
          >
            <div className="flex justify-between items-end w-full text-[14px]">
              Active Devices
            </div>
            <div className="flex items-baseline leading-none">
              <div className="text-[48px] tracking-tighter">50</div>
              <p className="text-[14px] font-bold ml-3">Operating</p>
            </div>
          </Card>

          <Card 
            onClick={()=>router.push("/devices")}
            className=" w-full flex flex-col justify-between font-semibold bg-[#EF4444] text-white"
          >
            <div className="flex justify-between items-end w-full">
              <p className="font-semibold text-[14px]">Inactive Devices</p>
            </div>
            <div className="flex items-baseline leading-none">
              <div className="text-[48px] tracking-tighter">4</div> 
              <p className="text-[14px] font-bold ml-[12px]">Offline</p>
            </div>
          </Card>
        </div>

        {/* CHART */}
        <Card className="bg-white h-full p-[20px] flex flex-col">
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
  );
}
