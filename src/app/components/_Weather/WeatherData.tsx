'use client';

import React, { useEffect } from 'react';
import { 
  LocationHeartFilled, LocationHazard, TemperatureFahrenheit,
  WindyDust, Windy, WindyStrong, WindySnow,
  Sun, Moon, PartlyCloudy, PartlyCloudyNight, Cloudy, Fog, Haze, HazeNight, MostlyCloudy, MostlyCloudyNight,
} from '@carbon/icons-react';

interface WeatherDataProps {
  icon: string,
  data: string | number
}

const WeatherData = (props: WeatherDataProps) => {
  const { icon, data } = props;

  return (
    <div className="p-5 text-sm">
      <div className="inline-block">
        {icon === "location" && <LocationHeartFilled />}
        {icon === "weather" && <Sun/>}
        {icon === "temp" && <TemperatureFahrenheit/>}
        {icon === "wind" && <WindyDust/>}
      </div>
      <div className="inline-block p-1">{data}</div>
    </div>
  );
};

export default WeatherData;