import { useState, useEffect } from 'react';
import { weatherApiRequest } from '@/app/lib/d';

const useWeatherApi = (props: weatherApiRequest) => {
  const { url, options, params } = props;
  const [data, setData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // const abortController = new AbortController();
    fetchData(url, options, params); 

    // return () => {
    //   abortController.abort();
    // };
  }, [url]);


  const fetchData = async (url: string, options?: any, params?: any) => {
    setIsLoading(true);

    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${params?.lat}&lon=${params?.lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`, {
        ...options,
        // signal
      });
      const json = await res.json();
      setData(json);
    } catch (error:any) {
      console.log(error);
      if (error.name==="AbortError") {
        console.log("Api call was aborted");
      } else {
        setError(error);
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return [data, isLoading, error];
}

export default useWeatherApi;