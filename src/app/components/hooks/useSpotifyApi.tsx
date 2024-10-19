import { useState, useEffect } from 'react';

// Utility functions related to Spotify API

// User related functions
export const getUserData = async (signal?: AbortSignal) => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    signal: signal,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + localStorage.access_token },
  });

  return await response.json();
}

export const getUsersTopItems = async (signal?: AbortSignal) => {
  const response = await fetch("https://api.spotify.com/v1/me/top/artists", {
    signal: signal,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + localStorage.access_token }
  });

  return await response.json();
}

  // Spotify related functions
export const getGenres = async (signal?: AbortSignal) => {
  const response = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
    signal: signal,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + localStorage.access_token }
  });

  return await response.json();
}

interface apiProps {
  url: string,
  options?: {
    method: "POST" | "GET" | undefined, // fetch will default to GET
    body: object | undefined
  } | {} | undefined,
  params?: object
}

// Custom hook
const useSpotifyApi = (props: apiProps) => {
  const { url, options, params } = props;
  const [data, setData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  console.log("useSpotifyApi");

  useEffect(() => {
    const controller = new AbortController();
    // If we have a token, we're logged in, so fetch user data and render logged in template
    if (localStorage.access_token) {
      setIsLoading(true);

      getUsersTopItems(controller.signal).then((data) => {
        console.log("getUserData data", (data.error));
        if(data.error) {
          throw data.error;
        }
        setData((prevData:any) => {
          console.log("previous useSpotifyApi data", prevData);
          console.log(data);
          return data;
        });
      }).catch((error) => {
        if (error.name === "AbortError") {
          console.log("Spotify API call was aborted");
        } else {
          console.log("Error getting user data");
          setError(error);
          setIsLoading(false);
        }
      }).finally(() => {
        setIsLoading(false);
      });
    }

    return () => controller.abort();
  }, []);

  return [data, isLoading, error];
}

export default useSpotifyApi;