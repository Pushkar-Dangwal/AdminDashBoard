import React, { memo } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

// TopoJSON for world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Define TypeScript interfaces
interface LeakData {
  country: string;
  count: number;
  riskLevel?: string;
  lastDetected?: string;
}

interface WorldMapProps {
  leakData: LeakData[];
  setTooltipContent: (content: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ leakData = [], setTooltipContent }) => {
  // Maximum leak count for scaling
  const maxLeakCount = Math.max(...leakData.map(d => d.count), 1);
  
  // Country code conversion (from your format to ISO_A3)
  const countryMapping: Record<string, string> = {
    'US': 'USA',
    'SA': 'SAU',
    'AK': 'USA'
  };

  // Pre-calculated positions for markers
  const markerPositions: Record<string, [number, number]> = {
    'US': [-97, 38],
    'SA': [45, 25],
    'AK': [-150, 65]
  };

  // Function to determine if a country has leak data
  const hasLeakData = (geoCountry: string | undefined): boolean => {
    if (!geoCountry) return false;
    
    // Get our matching country code
    const ourCountry = Object.keys(countryMapping).find(
      c => countryMapping[c] === geoCountry
    );
    
    return Boolean(ourCountry && leakData.some(d => d.country === ourCountry));
  };
  
  // Function to get fill color based on leak data
  const getFillColor = (geoCountry: string | undefined): string => {
    if (!geoCountry) return "#2d3748"; // Default dark color
    
    // Convert from ISO to our code
    const ourCountry = Object.keys(countryMapping).find(
      c => countryMapping[c] === geoCountry
    );
    
    if (!ourCountry) return "#2d3748";
    
    // Get our data for this country
    const data = leakData.find(d => d.country === ourCountry);
    if (!data) return "#2d3748";
    
    // Calculate color intensity based on leak count
    const intensity = Math.min(0.9, 0.3 + (data.count / maxLeakCount) * 0.7);
    
    if (ourCountry === 'US') return `rgba(220, 38, 38, ${intensity})`;
    if (ourCountry === 'SA') return `rgba(234, 88, 12, ${intensity})`;
    return `rgba(59, 130, 246, ${intensity})`;
  };

  return (
    <div data-tip="" className="w-full h-full">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: 170,
          center: [0, 0]
        }}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#111827",
          overflow: "hidden"
        }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoCountry = geo.properties.ISO_A3;
                const hasData = hasLeakData(geoCountry);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const countryName = geo.properties.NAME;
                      const country = Object.keys(countryMapping).find(
                        c => countryMapping[c] === geoCountry
                      );
                      
                      if (country) {
                        const data = leakData.find(d => d.country === country);
                        if (data) {
                          setTooltipContent(`${countryName}: ${data.count} leaks detected`);
                          return;
                        }
                      }
                      
                      setTooltipContent(`${countryName}: No leaks detected`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill: getFillColor(geoCountry),
                        stroke: "#1f2937",
                        strokeWidth: 0.5,
                        outline: "none"
                      },
                      hover: {
                        fill: hasData ? "#ef4444" : "#374151",
                        stroke: "#f7fafc",
                        strokeWidth: 0.75,
                        outline: "none"
                      },
                      pressed: {
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
          
          {/* Add markers for countries with leaks */}
          {leakData.map(({ country, count }) => {
            const coordinates = markerPositions[country] || [0, 0];
            const radius = Math.min(10, 4 + (count / maxLeakCount) * 8);
            
            return (
              <Marker key={country} coordinates={coordinates}>
                <circle
                  r={radius}
                  fill={
                    country === 'US' ? "#ef4444" :
                    country === 'SA' ? "#f97316" : "#3b82f6"
                  }
                  stroke="#ffffff"
                  strokeWidth={1}
                  opacity={0.8}
                />
                <text
                  textAnchor="middle"
                  y={-radius - 5}
                  style={{
                    fontFamily: "system-ui",
                    fontSize: "10px",
                    fill: "#ffffff",
                    fontWeight: "bold",
                    textShadow: "0px 0px 3px #000000"
                  }}
                >
                  {country}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-70 p-2 rounded flex flex-wrap gap-2 text-xs">
        {leakData.map((item) => (
          <div key={item.country} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ 
                backgroundColor: 
                  item.country === 'US' ? "#ef4444" :
                  item.country === 'SA' ? "#f97316" : "#3b82f6"
              }}
            />
            <span className="text-xs text-white">{item.country}: {item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(WorldMap);