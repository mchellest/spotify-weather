'use client';

import React, { useEffect, useState } from 'react';
import { spotifyUserDataRequest } from '@/app/lib/requests';
// Hooks
import { useLocalStorage } from '@/app/components/hooks/useLocalStorage';
import useSpotifyAuth from '@/app/components/hooks/useSpotifyAuth';
import useSpotifyApis from '@/app/components/hooks/useSpotifyApis';
import useWeatherApi from '@/app/components/hooks/useWeatherApi';
// Components
import WeatherCard from '@/app/components/_Weather/WeatherCard';
import SpotifyCard from '@/app/components/_Spotify/SpotifyCard';
import CustomButton from '@/app/components/CustomButton';
// Icons
import { Rotate, CheckmarkFilled, CheckmarkFilledError, Login, Logout, Erase, Renew } from '@carbon/icons-react'

export default function Home() {
  const [isDataReady, setIsDataReady] = useState<boolean>(false);
  // Weather state variables
  const [locationPerms, setLocationPerms] = useState<string>("");
  const [userCoordinates, setUserCoordinates] = useLocalStorage("userCoordinates", "{ lat:null, lon:null }");
  const [weatherData, isWeatherLoading, weatherError] = useWeatherApi({
    url: 'https://api.openweathermap.org/data/2.5/weather?',
    options: {},
    params: { lat: userCoordinates.lat, lon: userCoordinates.lon }
  })
  const [validLocationPerms, setValidLocationPerms] = useState<boolean | null>(null);
  // Spotify state variables
  const { handleLoginWithSpotify, handleRefreshToken, handleLogoutOfSpotify  } = useSpotifyAuth();
  const [spotifyData, isSpotifyLoading, spotifyError] = useSpotifyApis(spotifyUserDataRequest);
  const [spotifyConn, setSpotifyConn] = useState<boolean | null>(null);

  useEffect(() => {
    // On render, check localStorage for Spotify information since we will be redirected back to this page
    if (localStorage.access_token === "undefined")
      handleLogoutOfSpotify();
    else if (localStorage.access_token === undefined)
      setSpotifyConn(false);
    else 
      setSpotifyConn(true);

    if(userCoordinates.lat && userCoordinates.lon)
      setValidLocationPerms(true);
  }, []);

  useEffect(() => {
    if(["granted"].includes(locationPerms) && (userCoordinates.lat && userCoordinates.lon)) {
      setValidLocationPerms(true);
    }
  }, [locationPerms]);

  useEffect(() => {
    if(validLocationPerms && spotifyConn) {
      handleDataDisplayAnimation();
    } 
  }, [validLocationPerms, spotifyConn])

  const handleUserLocation = () => {
    setLocationPerms("pending");
    const options = {
      maximumAge: 3600,
      enableHighAccuracy: false,
      // timeout: 1000,
    }
    const success = (res:any) => {
      setLocationPerms("granted");
      let coords = res.coords;
      console.log("userCoordinates", { lat:coords.latitude, lon:coords.longitude });
      setUserCoordinates({ lat:coords.latitude, lon:coords.longitude });
    };
    const error = (err:any) => {
      setLocationPerms("error");
      console.log("Error fetching user location", err);
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  const clearCoordinates = () => {
    setUserCoordinates({ lat:null, lon:null });
  }

  const handleSpotifyConnection = () => {
    handleLoginWithSpotify();
    setSpotifyConn(true);
  };

  const handleDataDisplayAnimation = () => {
    // console.log("Start animation");
    // setTimeout(() => {
      console.log("Animation complete");
      setIsDataReady(true);
    // }, 500);
  }

  return (
    <>
      <div className="flex items-end" data-testid="options-nav">
        {spotifyData && <>
          <div>
            {spotifyData.display_name}
            {<img src={spotifyData.images[0].url} height="15%" width="15%" />}
          </div>
          <div>
            {spotifyError && spotifyError.status === 401 &&
              <CustomButton 
                icon={<Renew />} 
                onclick={handleRefreshToken}
                text={""} 
              />}
            <CustomButton 
              icon={<Logout />} 
              onclick={handleLogoutOfSpotify}
              text={""} 
            />
          </div>
        </>}
      </div>
      <div className="flex items-center justify-center w-screen h-screen mx-auto">
        <div className="basis-1/2 rounded-md w-1/2 h-3/4 bg-white bg-opacity-5 sm:text-blue sm:min-w-[65%]">
          {!isDataReady && <div className="grid"
              data-testid="start-card">
                <p>Get started</p>
                <CustomButton
                  icon={(validLocationPerms) ? <CheckmarkFilled />
                    : (locationPerms === "pending") ? <Rotate className="animate-spin "/> 
                    : (locationPerms === "error" ? <CheckmarkFilledError /> : <Rotate />)
                  } 
                  text={"Allow Location"}
                  onclick={handleUserLocation}
                  disabled={(userCoordinates.lat && userCoordinates.lon)}
                />
                <CustomButton 
                  externalLink={true}
                  icon={!spotifyConn
                    ? <Login />
                    : <CheckmarkFilled />
                  } 
                  onclick={handleSpotifyConnection}
                  text={"Connect to Spotify"}
                  disabled={(localStorage.access_token)}
                />
                <CustomButton 
                  icon={<Logout />} 
                  onclick={handleLogoutOfSpotify}
                  text={"Logout of Spotify"} 
                />
                <CustomButton 
                  icon={<Renew />} 
                  onclick={handleRefreshToken}
                  text={"Refresh Token"} 
                />
                <CustomButton 
                  icon={<Erase />} 
                  onclick={clearCoordinates}
                  text={"Remove Coordinates (debugging)"} 
                />
            </div>}
            {isDataReady && 
              <>
                <WeatherCard data={weatherData} isLoading={isWeatherLoading} />
                <SpotifyCard isSpotifyLoading={isSpotifyLoading} spotifyData={spotifyData} spotifyError={spotifyError} handleRefreshToken={handleRefreshToken} />
              </>}
        </div>
      </div>
    </>
    
  );
}
