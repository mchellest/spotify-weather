import { useCallback, useState, useEffect } from 'react';
import { spotifyApiRequest } from '@/app/lib/d';

const useSpotifyApis = (props: spotifyApiRequest) => {
  const { url, method, params } = props;
  const [data, setData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const parseParameters = async (url: string, params: object | null | undefined) => {
    const urlObject = new URL(url);
    if (!params || Object.keys(params).length === 0) {
      return urlObject.toString();
    }

    for (const [key, value] of Object.entries(params)) {
      urlObject.searchParams.append(key, value);
    }
    return urlObject.toString();
  }

  const fetchData = useCallback(async (signal: AbortSignal)  => {
    const fullUrl = await parseParameters(url, params);
    const response = await fetch(fullUrl, {
      signal: signal,
      method: method,
      headers: { 'Authorization': 'Bearer ' + localStorage.access_token }
    });

    return await response.json();
  }, [url]);

  useEffect(() => {
    const controller = new AbortController();
    
    if (localStorage.access_token) {
      setIsLoading(true);

      fetchData(controller.signal).then((data) => {
        if(data.error) 
          throw data.error

        setData(data);
      }).catch((error) => {
        if (error.name === "AbortError") {
          console.log("Spotify API call was aborted");
        } else {
          console.log("Error getting user data");
          setError(error);
        }
      }).finally(() => {
        setIsLoading(false);
      });

    }
    return () => controller.abort();
  }, [fetchData]);

  return [data, isLoading, error];
}

export default useSpotifyApis;