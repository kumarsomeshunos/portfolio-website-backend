import axios from "axios";
import { spotify } from "../spotify/spotify.js";

export async function lastfm(limit) {
   // Variables
   const lastfmBaseUrl = process.env?.LASTFM_API_BASE_URL;
   const lastfmUser = process.env?.LASTFM_USER;
   const lastfmApiKey = process.env?.LASTFM_API_KEY;

   try {
      const response = await axios.get(
         `${lastfmBaseUrl}?method=user.getrecenttracks&user=${lastfmUser}&api_key=${lastfmApiKey}&format=json&limit=${limit}`,
      );
      if (response.status !== 200) return null;
      const lastfmData = response.data.recenttracks.track;
      lastfmData.map(item => {
         item.image = item.image[3]["#text"];
         item.artist = item.artist["#text"];
         item.album = item.album["#text"];
         item.date ? (item.date = item.date["#text"]) : (item.date = null);
         item["@attr"] ? (item["@attr"] = true) : (item["@attr"] = false);
         delete item["mbid"];
         delete item["streamable"];
      });
      const spotifyData = await spotify(lastfmData[0].name);
      return { lastfmData, spotifyData };
   } catch (error) {
      return null;
   }
}
