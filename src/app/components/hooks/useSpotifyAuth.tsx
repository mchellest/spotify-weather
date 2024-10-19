/**
 * Hook that will perform auth with PKCE auth for Spotify
 * Referenced: 
 *  https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 *  https://github.com/spotify/web-api-examples/tree/master/authorization/authorization_code_pkce
 *
 * Steps: 
 * - Code Challenge generation from a Code Verifier
 * - Request Auth from the user and retrieve the auth code
 * - Request an access token from auth code
 * - Finally, access token used to make api call
 */

import { useEffect, useState } from "react";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const redirectUrl = 'http://localhost:3000/'; // Might have to change

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email user-top-read';

const args = new URLSearchParams(window.location.search);
const code = args.get('code');

const useSpotifyAuth = () => {
  const [spotifyAuthData, setSpotifyAuthData] = useState<any>({});
  // Data structure that manages current active token and caches it to local storage
  const currentToken = {
    get access_token() { return localStorage.getItem('access_token') || null; },
    get refresh_token() { return localStorage.getItem('refresh_token') || null; },
    get expires_in() { return localStorage.getItem('refresh_in') || null },
    get expires() { return localStorage.getItem('expires') || null },
  
    save: function (response: any) {
      const { access_token, refresh_token, expires_in } = response;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);
  
      const now = new Date();
      const expiry = new Date(now.getTime() + (expires_in * 1000));
      localStorage.setItem('expires', expiry.toDateString());
    }
  };

  // On use, try to fetch auth code from current browser search URL
  useEffect(() => {
    const controller = new AbortController();

    // If we find a code, we're in a callback, do a token exchange
    if (code) {
      getToken(code, controller.signal).then((token) => {
        currentToken.save(token);
      }).catch((error) => {
        console.error("Error getting Spotify token: ", error);
      }).finally(() => {
        // Remove code from URL so we can refresh correctly.
        const url = new URL(window.location.href);
        url.searchParams.delete("code");

        const updatedUrl = url.search ? url.href : url.href.replace('?', '');
        window.history.replaceState({}, document.title, updatedUrl);
      });
    }

    // Otherwise we're not logged in, so render the login template
    if (!code && !currentToken.access_token) {
      setSpotifyAuthData({});
    }

    return () => controller.abort();
  }, [code]);

  // Append search parameters to URLSearchParams() given an object with key/value pairs
  // Returns modified URLSearchParams object
  const appendSearchParameters = (paramsObj: Array<{key:string, value:any}>) => {
    const searchParams: URLSearchParams = new URLSearchParams();
    paramsObj.forEach((param) => {
      if (!!param.value) {
        searchParams.append(param.key, param.value);
      }
    });

    return searchParams;
  }

  const redirectToSpotifyAuthorize = async () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");
  
    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);
  
    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  
    window.localStorage.setItem('code_verifier', code_verifier);
  
    const authUrl = new URL(authorizationEndpoint);
    const reqParams = appendSearchParameters([
      { key: "client_id", value: clientId },
      { key: "response_type", value: 'code' },
      { key: "redirect_uri", value: redirectUrl },
      // { key: "state", value: state }, // TODO
      { key: "scope", value: scope },
      { key: "code_challenge_method", value: 'S256' },
      { key: "code_challenge", value: code_challenge_base64 },
    ]);
  
    authUrl.search = new URLSearchParams(reqParams).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  }

  
  // Spotify API Calls
  const getToken = async (code: string, signal: AbortSignal) => {
    const code_verifier = localStorage.getItem('code_verifier');
    const reqParams = appendSearchParameters([
      { key: "client_id", value: clientId },
      { key: "grant_type", value: "authorization_code" },
      { key: "code", value: code },
      { key: "redirect_uri", value: redirectUrl },
      { key: "code_verifier", value: code_verifier }
    ]);

    const response = await fetch(tokenEndpoint, {
      signal: signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: reqParams,
    });

    return await response.json();
  }
  
  const refreshToken = async () => {
    const reqParams = appendSearchParameters([
      { key: "client_id", value: clientId },
      { key: "grant_type", value: "refresh_token" },
      { key: "refresh_token", value: currentToken.refresh_token },
    ]);
    
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: reqParams
    });

    return await response.json();
  }
  
  // Click handlers
  const handleLoginWithSpotify = async () => {
    await redirectToSpotifyAuthorize();
  }
  
  const handleRefreshToken = async () => {
    refreshToken().then((token) => {
      currentToken.save(token);
    }).catch((error) => {
      console.error("Error getting Spotify token: ", error);
    });
  }

  const handleLogoutOfSpotify = async () => {
    localStorage.clear();
    window.location.href = 'http://localhost:3000';
  }

  return { handleLoginWithSpotify, handleRefreshToken, handleLogoutOfSpotify, spotifyAuthData };

};

export default useSpotifyAuth;
