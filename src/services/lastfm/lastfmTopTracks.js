import axios from "axios";
import { writeFile } from "fs/promises";
import { spotify } from "../spotify/spotify.js";

export async function lastfmTopTracks(limit) {
   // Variables
   const lastfmBaseUrl = process.env?.LASTFM_API_BASE_URL;
   const lastfmUser = process.env?.LASTFM_USER;
   const lastfmApiKey = process.env?.LASTFM_API_KEY;

   try {
      const response = await axios.get(
         `${lastfmBaseUrl}?method=user.gettoptracks&user=${lastfmUser}&api_key=${lastfmApiKey}&format=json&limit=${limit}`,
      );
      if (response.status !== 200) return null;
      let lastfmData = response.data.toptracks.track;
      lastfmData = lastfmData.map(item => {
         item.image = item.image[3]["#text"];
         item.artist = item.artist["name"];
         item["@attr"].rank
            ? (item["@attr"].rank = item["@attr"].rank)
            : (item["@attr"].rank = null);
         delete item["mbid"];
         delete item["streamable"];
         return item;
      });

      // Fetch Spotify data for all items
      const spotifyData = await Promise.all(
         lastfmData.map(async item => {
            let mydata = await spotify(item.name);
            return { ...item, spotify: mydata };
         }),
      );

      // Write all the lastfm and spotify data to TopTracks.json file
      const writeJSON = async () => {
         try {
            await writeFile(
               "TopTracks.json",
               JSON.stringify(spotifyData, null, 2),
            );
            console.log("Top tracks data written to TopTracks.json file.");
         } catch (err) {
            console.error(err);
         }
      };

      writeJSON();

      return { spotifyData };
   } catch (error) {
      return null;
   }
}
