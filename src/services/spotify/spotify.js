import axios from "axios";
import { spotifyAccessTokenGenerator } from "./spotifyAccessTokenGenerator.js";

export async function spotify(title) {
   // Variables
   const spotifyBaseUrl = process.env?.SPOTIFY_BASE_URL;

   const spotifyAccessToken = await spotifyAccessTokenGenerator();

   // Headers for Spotify
   const spotifyHeaders = {
      Authorization: `Bearer ${spotifyAccessToken}`,
   };

   // Processors
   let response = null;

   try {
      response = await axios.get(
         `${spotifyBaseUrl}/search?q=${title}&type=track&limit=1&offset=0&include_external=audio`,
         { headers: spotifyHeaders },
      );
      const spotifyData = response.data;
      const filteredSpotifyData = {
         external_url: spotifyData.tracks.items[0].external_urls.spotify,
         uri: spotifyData.tracks.items[0].uri,
         preview_url: spotifyData.tracks.items[0].preview_url,
         duration_ms: spotifyData.tracks.items[0].duration_ms,
         id: spotifyData.tracks.items[0].id,
      };
      return filteredSpotifyData;
   } catch (error) {
      console.log(error);
      return null;
   }
}
