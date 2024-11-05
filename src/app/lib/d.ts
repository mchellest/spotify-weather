// Weather related Interfaces
export interface weatherApiRequest {
  url: string,
  options?: {
    method: "POST" | "GET" | undefined, // fetch will default to GET
    body: object | undefined
  } | {} | undefined,
  params?: {
    lat: number,
    lon: number,
    appid: string
  } | {} | undefined // TODO specify body of Spotify Api call
}

export interface weaterApiData {
  weather: [{main: string, description: string}],
  main: {temp: number, feels_like: number, pressure: number, humidity: number},
  visibility: number,
  wind: {speed: number, deg: number},
  clouds: {all: number},
  sys: {country: string, sunrise: number, sunset: number},
  name: string
}

// Spotify related Interfaces
export interface spotifyApiRequest {
  url: string,
  method?: 'GET' | 'POST',
  params?: object | null
}

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