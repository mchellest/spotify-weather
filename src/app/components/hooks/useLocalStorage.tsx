import { useState, useEffect } from 'react';

function getValue(key:string, defaultValue:string) {
  const savedValue = localStorage.getItem(key);
  const parsedValue = savedValue ? JSON.parse(savedValue) : null;
  return parsedValue || defaultValue;
}

export const useLocalStorage = (key:string, defaultValue:string) => {
  const [value, setValue] = useState(() => {
    return getValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];

}