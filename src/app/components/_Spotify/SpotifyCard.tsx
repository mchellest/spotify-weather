'use client';

import React from 'react';
import CustomButton from '@/app/components/CustomButton';
import { CardsSkeleton } from '@/app/components/skeletons';
import { spotifyUserTopItems, spotifyRecommendations } from '@/app/lib/requests';
import { TrackRecommendations } from '@/app/lib/d';
import { Renew } from '@carbon/icons-react';
// import useSpotifyAuth from '@/app/components/hooks/useSpotifyAuth';
import useSpotifyApis from '@/app/components/hooks/useSpotifyApis';

// const SpotifyData = React.lazy(() => import ('@/app/components/_Spotify/SpotifyData'));

interface SpotifyCardProps {
  isSpotifyLoading: boolean,
  spotifyData: object,
  spotifyError: any,
  handleRefreshToken: any
}

const SpotifyCard = (props: SpotifyCardProps) => {
  const { isSpotifyLoading, spotifyData, spotifyError, handleRefreshToken } = props;
  const [topItemsData, isTopItemsLoading, topItemsError] = useSpotifyApis(spotifyUserTopItems);
  const [recData, isRecLoading] = useSpotifyApis(spotifyRecommendations({limit: 10, market: "US", seed_artists: "5ioOCIkpBfV9Z8Zm5DP4vH,4IliztYDlfMvzQzbx50o60,4G9wSdX0klmoHfjm9i6DLd,0PCCGZ0wGLizHt2KZ7hhA2"}));

  const displayUserData = (data:any) => {
    return (
      <div>
        <h1>Logged in as {data.display_name}</h1>
        <img src={data.images[0].url} height="10%" width="10%" />
      </div>
    );
  }

  const filterTopItems = (data: {items: Array<{name:string, id:string, genres:Array<String>}>}) => {
    const spotifyItems = data.items;
    const listItems = spotifyItems.map((item) => (
      <li><p>{`${item.name} (${item.id}) [${item.genres.toString()}]`}</p></li>
    ));
    return <ul>{listItems}</ul>;
  }

  // const generateSeed = (type: string, data:any) => {
  //   return 
  // }

  const displayRecommendations = (data:TrackRecommendations) => {
    const recommendedTracks = data.tracks;
    const listRecommendedTracks = recommendedTracks.map(({name, artists}) => {
      return <li><p><span className="track-name">{name}</span> by <span className="track-artists">{artists.map((artist:any) => artist.name).join(', ')}</span></p></li>
    });
    return (<div className="track-recommendations">
      <ul>{listRecommendedTracks}</ul>
    </div>);
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
      {spotifyError && spotifyError.status !== 401 &&
        <p>{spotifyError.message}</p>
      }
      {(spotifyError || isSpotifyLoading) && <CardsSkeleton />}
      {/* {!isSpotifyLoading && spotifyData && displayUserData(spotifyData)} */}
      {/* {!isTopItemsLoading && topItemsData && filterTopItems(topItemsData)} */}
      {!isRecLoading && recData && displayRecommendations(recData)}
      {/* <Suspense fallback={<CardsSkeleton />}>
        <p>{JSON.stringify(topItems)}</p>
      </Suspense> */}
    </div>
  );
};

export default SpotifyCard;