'use client';

import React, { Suspense, useEffect, useState } from 'react';
import CustomButton from '@/app/components/CustomButton';
import { CardsSkeleton } from '@/app/components/skeletons';
import { spotifyUserTopItems, spotifyRecommendations } from '@/app/lib/requests';
import { Renew } from '@carbon/icons-react';
// import useSpotifyAuth from '@/app/components/hooks/useSpotifyAuth';
import useSpotifyApis from '@/app/components/hooks/useSpotifyApis';

const SpotifyData = React.lazy(() => import ('@/app/components/_Spotify/SpotifyData'));

interface SpotifyCardProps {
  isSpotifyLoading: boolean,
  spotifyData: object,
  spotifyError: any,
  handleRefreshToken: any
}

const SpotifyCard = (props: SpotifyCardProps) => {
  const { isSpotifyLoading, spotifyData, spotifyError, handleRefreshToken } = props;
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
        <img src={data.images[0].url} height="10%" width="10%" />
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


  return (
    <div className="p-5 text-sm">
      {spotifyError && spotifyError.status === 401 &&
        <CustomButton 
          icon={<Renew />} 
          onclick={handleRefreshToken}
          text={"Refresh Token"} 
        />
      }
      {isSpotifyLoading && <CardsSkeleton />}
      {!isSpotifyLoading && spotifyData && displayUserData(spotifyData)}
      {!isTopItemsLoading && topItemsData && filterTopItems(topItemsData)}
      {/* <Suspense fallback={<CardsSkeleton />}>
        <p>{JSON.stringify(topItems)}</p>
      </Suspense> */}
    </div>
  );
};

export default SpotifyCard;