'use client';

import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import useSpotifyAuth from '@/app/components/hooks/useSpotifyAuth';
import { Rotate, CheckmarkFilled, CheckmarkFilledError } from '@carbon/icons-react'
import CustomButton from '@/app/components/CustomButton';

interface StartProps {
  locationPerms: string,
  setLocationPerms: Dispatch<SetStateAction<string>>
  spotifyConn: boolean,
  setSpotifyConn: Dispatch<SetStateAction<boolean>>,
  setCoordinates: Dispatch<SetStateAction<{lat:number|null, lon:number|null}>>
}

const StartCard = (props: StartProps) => {
  const { locationPerms, setLocationPerms, spotifyConn, setSpotifyConn, setCoordinates } = props;
  const { handleLoginWithSpotify, handleRefreshToken, handleLogoutOfSpotify, spotifyAuthData } = useSpotifyAuth();

  useEffect(() => {
    console.log("StartCard - Something we care about changed!");
    console.log(" > LocationPerms", locationPerms);
    console.log(" > spotifyAuthData", spotifyAuthData);
  }, [locationPerms, spotifyAuthData]);

  const handleSpotifyConnection = () => {
    handleLoginWithSpotify();
    setSpotifyConn(true);
  }

  const handleUserLocation = () => {
    console.log("getUserLocation")
    setLocationPerms("pending");
    const options = {
      maximumAge: 0,
      enableHighAccuracy: false,
      // timeout: 1000,
    }
    const success = (res:any) => {
      setLocationPerms("granted");
      let coords = res.coords;
      console.log(coords.latitude, coords.longitude);
      setCoordinates({ lat:coords.latitude, lon:coords.longitude });
    };
    const error = (err:any) => {
      setLocationPerms("error");
      console.log("Error fetching user location", err);
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
  
  return (
    <div className="basis-1/2 rounded-md w-1/2 h-3/4 bg-white bg-opacity-5 sm:text-blue sm:min-w-[65%]">
      <div className="grid"
        data-testid="start-card">
          <p>Get started</p>
          <CustomButton 
            icon={(locationPerms === "granted") ? <CheckmarkFilled />
              : (locationPerms === "pending") ? <Rotate className="animate-spin "/> 
              : (locationPerms === "error" ? <CheckmarkFilledError /> : <Rotate />)
            } 
            text={"Allow Location"} 
            onclick={handleUserLocation} 
          />
          <p></p>
          <CustomButton 
            externalLink={true}
            icon={!spotifyConn
              ? <Rotate />
              : <CheckmarkFilled />
            } 
            onclick={handleSpotifyConnection}
            text={"Connect to Spotify"} />
          <CustomButton 
            externalLink={true}
            icon={!spotifyConn
              ? <Rotate />
              : <CheckmarkFilled />
            } 
            onclick={handleLogoutOfSpotify}
            text={"Logout"} />
                      <CustomButton 
            externalLink={true}
            icon={!spotifyConn
              ? <Rotate />
              : <CheckmarkFilled />
            } 
            onclick={handleRefreshToken}
            text={"Refresh"} />
            <p>{JSON.stringify(spotifyAuthData)}</p>
            <p>{localStorage.access_token}</p>
      </div>
    </div>
  );
};

export default StartCard;