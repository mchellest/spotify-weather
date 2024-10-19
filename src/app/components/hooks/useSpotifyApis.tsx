import { useState, useEffect } from 'react';
interface apiProps {
  url: string,
  method?: "GET" | "POST"
}

const useSpotifyApis = (props: apiProps) => {
  const { url, method } = props;
  const [data, setData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (signal: AbortSignal) => {
    const response = await fetch(url, {
      signal: signal,
      method: method,
      headers: { 'Authorization': 'Bearer ' + localStorage.access_token }
    });

    return await response.json();
  }

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
  }, [url]);

  return [data, isLoading, error];
}

export default useSpotifyApis;