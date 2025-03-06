import React, { useState } from "react";
import WorldMap from "./WorldMap";

// Define interfaces for type safety
interface LeakData {
  country: string;
  count: number;
  riskLevel?: string;
  lastDetected?: string;
}

interface MapWithTooltipProps {
  leakData: LeakData[];
}

const MapWithTooltip: React.FC<MapWithTooltipProps> = ({ leakData }) => {
  const [content, setContent] = useState<string>("");

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0">
        <WorldMap setTooltipContent={setContent} leakData={leakData} />
      </div>
      
      {content && (
        <div 
          className="absolute bg-gray-900 text-white px-2 py-1 rounded text-sm" 
          style={{ 
            left: "50%", 
            bottom: "10px", 
            transform: "translateX(-50%)",
            zIndex: 1000,
            pointerEvents: "none"
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default MapWithTooltip;