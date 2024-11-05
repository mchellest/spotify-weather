export interface weaterApiData {
  weather: [{main: string, description: string}],
  main: {temp: number, feels_like: number, pressure: number, humidity: number},
  visibility: number,
  wind: {speed: number, deg: number},
  clouds: {all: number},
  sys: {country: string, sunrise: number, sunset: number},
  name: string
}

// export interface spotifyApiData {

// }
// Spotify types
export interface Artist {
  external_urls: object,
  href: string,
  id: string,
  name: string,
  type: string,
  uri: string
}
export interface Track {
  name: string;
  artists: Artist[];
}
export interface TrackRecommendations {
  tracks: Track[];
}