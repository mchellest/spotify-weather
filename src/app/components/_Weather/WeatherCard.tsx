'use client';

import React, { Suspense } from 'react';
import WeatherData from '@/app/components/_Weather/WeatherData';
import { CardsSkeleton } from '@/app/components/skeletons';

interface weatherProps {
  data: {
    name: string,
    weather: any,
    main: { temp: number },
    wind: { speed: number }
  },
  isLoading: boolean
}

const WeatherCard = (props: weatherProps) => {
  const { data, isLoading } = props;

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