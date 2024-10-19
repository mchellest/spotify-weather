export const weatherRequest = (lat: number, lon: number) => {
  return {
    url: 'https://api.openweathermap.org/data/2.5/weather?',
    options: {},
    params: { lat: lat, lon: lon }
  }
};
export const spotifyUserDataRequest = {
    url: "https://api.spotify.com/v1/me",
    method: 'GET'
}
export const spotifyUserTopItems = {
    url: 'https://api.spotify.com/v1/me/top/artists',
    method: 'GET'
}
export const spotifyRecommendations = (
  params: {
    limit?: number,
    market?: string,
    // Track features
    min_danceability?: number, // 0 - least, 1 - most
    max_danceability?: number,
    min_energy?: number, // 0 - least, 1 - most
    max_energy?: number,
    min_instrumentalness?: number,
    max_instrumentalness?: number,
    mode?: 1 | 0, // 0 - Minor, 1 - Major
    min_tempo: number, // BPM
    max_tempo: number,
    min_valence: number, // Low mood, high mood 
    max_valence: number
    seed_artists: string, // One seed required
    seed_genres: string,
    seed_tracks: string    
  }
) => {
  return {
    url: 'https://api.spotify.com/v1/recommendations',
    method: 'GET',
    params: {
      limit: params.limit,
      market: params.market,

    }
  }
}