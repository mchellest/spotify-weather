'use client';

import React, { useEffect, useState } from 'react';
import useWeatherApi from '@/app/components/hooks/useWeatherApi';
import WeatherCard from '@/app/components/_Weather/WeatherData';
import { weatherRequest } from '@/app/lib/requests';

interface dataProps {
  lat?: number | null
  lon?: number | null
}

const DataCard = (props: dataProps) => {
  const { lat, lon } = props;
  let [data, isLoading, error] = useWeatherApi(weatherRequest(lat, lon));

  useEffect(() => {
    console.log("DataCard - Something happened!!", data);
  }, [data]);

  return (
    <div className="basis-1/2 rounded-md w-1/2 h-3/4 bg-white bg-opacity-5 sm:text-blue sm:min-w-[65%]">
      {data && <div className="flex justify-between content-stretch"
        data-testid="weather-data">
          <WeatherCard icon="location" data={data.name} />
          <WeatherCard icon="weather" data={data.weather[0].main} />
          <WeatherCard icon="temp" data={data.main.temp} />
          <WeatherCard icon="wind" data={data.wind.speed} />
      </div>}
    </div>
  );
};

export default DataCard;