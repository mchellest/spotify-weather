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