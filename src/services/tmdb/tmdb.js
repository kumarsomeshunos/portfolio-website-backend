import axios from "axios";

export async function tmdb(title) {
   // Variables
   const TMDBAuthKey = process.env?.TMDB_AUTHORIZATION_KEY;
   const TMDBBaseUrl = process.env?.TMDB_API_BASE_URL;

   // Headers for TMDB
   const TMDBHeaders = {
      Authorization: TMDBAuthKey,
      "Content-Type": "application/json",
      Accept: "application/json",
   };

   try {
      const response = await axios.get(
         `${TMDBBaseUrl}/search/movie?query=${title}&include_adult=false&language=en-US&page=1`,
         { headers: TMDBHeaders },
      );

      const tmdbData = response.data.results[0];
      return tmdbData;
   } catch (error) {
      console.log(error);
      return null;
   }
}
