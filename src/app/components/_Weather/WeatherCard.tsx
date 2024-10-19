'use client';

import React, { Suspense, useEffect } from 'react';
import { weatherRequest } from '@/app/lib/requests';
import WeatherData from '@/app/components/_Weather/WeatherData';
import useWeatherApi from '@/app/components/hooks/useWeatherApi';
import { CardsSkeleton } from '@/app/components/skeletons';

interface weatherProps {
  lat: number,
  lon: number
}

const WeatherCard = (props: weatherProps) => {
  const { lat, lon } = props;
  const [data, isLoading, error] = useWeatherApi({
    url: 'https://api.openweathermap.org/data/2.5/weather?',
    options: {},
    params: { lat: lat, lon: lon }
  });

  return (
    <div className="flex justify-between content-stretch"
        data-testid="weather-data">
        {/* <Suspense fallback={<CardsSkeleton />}> */}
        {/* TODO Either SSR or Lazy loading*/}
        {isLoading && <CardsSkeleton />}
        {!isLoading && data && <>
          <WeatherData icon="location" data={data.name} />
          <WeatherData icon="weather" data={data.weather[0].main} />
          <WeatherData icon="temp" data={data.main.temp} />
          <WeatherData icon="wind" data={data.wind.speed} />
        </>}
        {/* TODO: error && */}
        {/* </Suspense> */}
    </div>
  )
}

export default WeatherCard;