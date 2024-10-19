import React from 'react';
import useSpotifyApi from '../hooks/useSpotifyApi';

interface SpotifyData {
  data:any
}

const SpotifyData = (props: SpotifyData) => {
  const [ getUsersTopItems ] = useSpotifyApi({});
  const resource = getUsersTopItems();

  const filterTopItems = () => {
    const spotifyItems = resource.items;
    const listItems = spotifyItems.map((item:{name:string}) => (
      <li><p>{item.name}</p></li>
    ));
    return <ul>{listItems}</ul>;
  }

  return (
    <div>
      <p>Top Items:</p>
      <ul>{filterTopItems(getUsersTopItems)}</ul>
    </div>
    
  );
}

export default SpotifyData;
