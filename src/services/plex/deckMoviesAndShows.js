import axios from "axios";
import { tmdb } from "./../tmdb/tmdb.js";

export async function deckMoviesAndShows() {
   // Variables
   const plexBaseUrl = process.env.PLEX_BASE_URL;
   const plexToken = process.env.PLEX_TOKEN;
   const TMDBImageBaseUrl = process.env?.TMDB_API_IMAGE_BASE_URL;

   // Header for plex
   const plexHeaders = {
      "X-Plex-Token": plexToken,
      "Content-Type": "application/json",
      Accept: "application/json",
   };

   // Processors
   let extractTags = items => items.map(item => item.tag);

   let extractRatingInfo = items =>
      items.map(item => ({
         image: item?.image,
         type: item?.type,
         value: item?.value,
      }));

   let processMetadata = plexMetadata => {
      let genre = plexMetadata?.Genre ? extractTags(plexMetadata.Genre) : [];
      let country = plexMetadata?.Country
         ? extractTags(plexMetadata.Country)
         : [];
      let rating = plexMetadata?.Rating
         ? extractRatingInfo(plexMetadata.Rating)
         : [];
      let director = plexMetadata?.Director
         ? extractTags(plexMetadata.Director)
         : [];
      let writer = plexMetadata?.Writer ? extractTags(plexMetadata.Writer) : [];

      return {
         id: null,
         adult: null,
         originalLanguage: null,
         originalTitleTMDB: null,
         overview: null,
         releaseDate: null,
         titleTMDB: null,
         backdropPath: null,
         posterPath: null,
         contentRating: plexMetadata?.contentRating,
         duration: plexMetadata?.duration,
         lastViewedAt: plexMetadata?.lastViewedAt,
         librarySectionTitle: plexMetadata?.librarySectionTitle,
         originalTitle: plexMetadata?.originalTitle,
         parentTitle: plexMetadata?.parentTitle,
         grandparentTitle: plexMetadata?.grandparentTitle,
         originallyAvailableAt: plexMetadata?.originallyAvailableAt,
         studio: plexMetadata?.studio,
         summary: plexMetadata?.summary,
         tagline: plexMetadata?.tagline,
         title: plexMetadata?.title,
         viewOffset: plexMetadata?.viewOffset,
         year: plexMetadata?.year,
         Genre: genre,
         Country: country,
         Rating: rating,
         Director: director,
         Writer: writer,
         User: { title: plexMetadata?.User?.title },
         Player: {
            title: plexMetadata?.Player?.title,
            model: plexMetadata?.Player?.model,
            platform: plexMetadata?.Player?.platform,
            state: plexMetadata?.Player?.state,
         },
      };
   };

   // Fetch live movies and shows
   try {
      const plexLiveMoviesAndShows = await axios.get(
         `${plexBaseUrl}/library/onDeck`,
         { headers: plexHeaders },
      );
      if (plexLiveMoviesAndShows.status !== 200) {
         return null;
      }
      let plexDataJson = plexLiveMoviesAndShows.data;
      if (plexDataJson.MediaContainer.size > 0) {
         let plexMetadata = plexDataJson.MediaContainer.Metadata[0];

         if (plexMetadata.type === "movie" || plexMetadata.type === "episode") {
            let plexMoviesAndShowsData = processMetadata(plexMetadata);
            let tmdbData = await tmdb(
               plexMoviesAndShowsData.title,
               plexMetadata.type,
            );
            plexMoviesAndShowsData.backdropPath = `${TMDBImageBaseUrl}/t/p/original${tmdbData?.backdrop_path}`;
            plexMoviesAndShowsData.posterPath = `${TMDBImageBaseUrl}/t/p/original${tmdbData?.poster_path}`;
            plexMoviesAndShowsData.id = tmdbData?.id;
            plexMoviesAndShowsData.adult = tmdbData?.adult;
            plexMoviesAndShowsData.originalLanguage =
               tmdbData?.original_language;
            plexMoviesAndShowsData.originalTitleTMDB = tmdbData?.original_title;
            plexMoviesAndShowsData.overview = tmdbData?.overview;
            plexMoviesAndShowsData.releaseDate = tmdbData?.release_date;
            plexMoviesAndShowsData.titleTMDB = tmdbData?.title;
            plexMoviesAndShowsData.originalTitle
               ? plexMoviesAndShowsData.originalTitle
               : (plexMoviesAndShowsData.originalTitle =
                    plexMoviesAndShowsData.originalTitleTMDB);
            plexMoviesAndShowsData.title
               ? plexMoviesAndShowsData.title
               : (plexMoviesAndShowsData.title =
                    plexMoviesAndShowsData.titleTMDB);
            plexMoviesAndShowsData.summary
               ? plexMoviesAndShowsData.summary
               : (plexMoviesAndShowsData.summary =
                    plexMoviesAndShowsData.overview);
            return plexMoviesAndShowsData;
         }
      }
   } catch (error) {
      console.log(error);
      return null;
   }
}
