'use client';

import React, { Suspense, useEffect, useState } from 'react';
import CustomButton from '@/app/components/CustomButton';
import { CardsSkeleton } from '@/app/components/skeletons';
import { spotifyUserDataRequest, spotifyUserTopItems, spotifyRecommendations } from '@/app/lib/requests';
import { Renew } from '@carbon/icons-react';
import useSpotifyAuth from '@/app/components/hooks/useSpotifyAuth';
import useSpotifyApis from '@/app/components/hooks/useSpotifyApis';
import useSpotifyApi from '../hooks/useSpotifyApi';

const SpotifyData = React.lazy(() => import ('@/app/components/_Spotify/SpotifyData'));

interface SpotifyCardProps {
  // mappedWeatherData: {
    
  // }
}

const SpotifyCard = (props: SpotifyCardProps) => {
  // const { data } = props;
  const { handleRefreshToken } = useSpotifyAuth();
  const [data, isLoading, error] = useSpotifyApis(spotifyUserDataRequest);
  const [topItemsData, isTopItemsLoading, topItemsError] = useSpotifyApis(spotifyUserTopItems);
  // const [recData, isRecLoading, recError] = useSpotifyApis(spotifyRecommendations({

  // }))

  // const filterTopItems = (data: {items: Array<{name:string}>}) => {
  //   const spotifyItems = data.items;
  //   const listItems = spotifyItems.map((item) => (
  //     <li><p>{item.name}</p></li>
  //   ));
  //   return <ul>{listItems}</ul>;
  // }

  const displayUserData = (data:any) => {
    return (
      <div>
        <h1>Logged in as {data.display_name}</h1>
        <img src={data.images[0].url} height={data.images[0].height} width={data.images[0].height} />
      </div>
    );
  }

  const displayRecommendations = (data:any) => {
    const recommendedTracks = data.tracks;
    const listRecommendedTracks = recommendedTracks.map(({name, artists}) => {
      <li><p>{name} by {artists.map(artist => artist.name).join(', ')}</p></li>
    })
    return <ul>listRecommendedTracks</ul>;
  }

  const handleRefreshAfterError = () => {
    handleRefreshToken();
  };

  return (
    <div className="p-5 text-sm">
      {error && error.status === 401 &&
        <CustomButton 
          icon={<Renew />} 
          onclick={handleRefreshAfterError}
          text={"Refresh Token"} 
        />
      }
      {isLoading && <CardsSkeleton />}
      {!isLoading && data && displayUserData(data)}
      {/* <Suspense fallback={<CardsSkeleton />}>
        <p>{JSON.stringify(topItems)}</p>
      </Suspense> */}
    </div>
  );
};

export default SpotifyCard;