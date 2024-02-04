import axios from "axios";

export async function tmdb(title, type) {
   // Variables
   const TMDBAuthKey = process.env?.TMDB_AUTHORIZATION_KEY;
   const TMDBBaseUrl = process.env?.TMDB_API_BASE_URL;

   // Headers for TMDB
   const TMDBHeaders = {
      Authorization: TMDBAuthKey,
      "Content-Type": "application/json",
      Accept: "application/json",
   };

   // Processors
   let response = null;

   try {
      if (type == "movie") {
         response = await axios.get(
            `${TMDBBaseUrl}/search/movie?query=${title}&include_adult=false&language=en-US&page=1`,
            { headers: TMDBHeaders },
         );
      } else {
         response = await axios.get(
            `${TMDBBaseUrl}/search/tv?query=${title}&include_adult=false&language=en-US&page=1`,
            { headers: TMDBHeaders },
         );
      }

      const tmdbData = response.data.results[0];
      return tmdbData;
   } catch (error) {
      console.log(error);
      return null;
   }
}
