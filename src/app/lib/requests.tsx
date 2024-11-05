import { spotifyApiRequest, weatherApiRequest } from "@/app/lib/d";

export const weatherRequest = (lat: number, lon: number): weatherApiRequest => {
  return {
    url: 'https://api.openweathermap.org/data/2.5/weather?',
    options: {},
    params: { lat: lat, lon: lon }
  }
};
export const spotifyUserDataRequest: spotifyApiRequest = {
    url: "https://api.spotify.com/v1/me",
    method: "GET" as const,
}
export const spotifyUserTopItems: spotifyApiRequest = {
    url: 'https://api.spotify.com/v1/me/top/artists',
    method: "GET" as const,
}

/**
 * spotifyReccomendations takes parameters to create an object to send using Spotify API for the /recommendations endpoint 
 * @param limit (number) - Target size of list, 1-100. Default = 20
 * @param market (string) - ISO 3166-1 alpha-2 country code. Ex: US
 * @param min_danceability (number) - 0-1 value, 0 being least and 1 being most
 * @param max_danceability (number) - 0-1 value, 0 being least and 1 being most
 * @param min_energy (number) - 0-1 value, 0 being least and 1 being most
 * @param max_energy (number) - 0-1 value, 0 being least and 1 being most
 * @param min_instrumentalness (number) - 0-1 value, 0 being least and 1 being most
 * @param max_instrumentalness (number) - 0-1 value, 0 being least and 1 being most
 * @param mode (number) - 0 or 1 value, 0 is minor, 1 is major
 * @param min_tempo (number) - Min BPM
 * @param max_tempo (number) - Max BPM
 * @param min_valence (number) - 0-1 value, 0 being low mood and 1 being high mood
 * @param max_valence (number) - 0-1 value, 0 being low mood and 1 being high mood
 * @param seed_artists Required (string) - Comma separated list of Spotify IDs for seed artists.
 * @param seed_genres Required (string) - Comma separated list of genres from the set available genre seeds.
 * @param seed_tracks Required (string) - Comma separated list of Spotify IDs for a seed track.
 * @returns Object - { url, method, params object } to be used in Spotify API request
 */
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
    min_tempo?: number, // BPM
    max_tempo?: number,
    min_valence?: number, // Low mood, high mood 
    max_valence?: number,
    seed_artists?: string, // One seed required
    seed_genres?: string,
    seed_tracks?: string    
  }
): spotifyApiRequest => {
  return {
    url: 'https://api.spotify.com/v1/recommendations',
    method: "GET" as const,
    params: {
      limit: params.limit,
      market: params.market,
      seed_artists: params.seed_artists || ''
    }
  }
}