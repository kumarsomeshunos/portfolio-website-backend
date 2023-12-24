import axios from "axios";

export async function moviesAndShows() {
   // Variables
   let plexBaseUrl = process.env.PLEX_BASE_URL;
   let plexToken = process.env.PLEX_TOKEN;

   // Header for plex
   const plexHeaders = {
      "X-Plex-Token": plexToken,
      "Content-Type": "application/json",
      Accept: "application/json",
   };

   let TMDBBaseUrl = process.env?.TMDB_API_BASE_URL;
   let TMDBImageBaseUrl = process.env?.TMDB_API_IMAGE_BASE_URL;

   // Header for TMDB
   const TMDBHeaders = {
      Authorization: process.env?.TMDB_AUTHORIZATION_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
   };

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

   // TMDB Data
   let tmdbData = async query => {
      try {
         let encodedQuery = encodeURIComponent(query);
         await axios
            .get(
               `${TMDBBaseUrl}/search/movie?query=${encodedQuery}&include_adult=true&language=en-US&page=1`,
               { headers: TMDBHeaders },
            )
            .then(response => {
               if (response.status !== 200) {
                  return null;
               }
               return response.data;
            })
            .catch(error => {
               return null;
            });
      } catch (error) {
         return null;
      }
   };

   // Fetch all movies
   try {
      let response = await axios.get(`${plexBaseUrl}/status/sessions`, {
         headers: plexHeaders,
      });

      if (response.status !== 200) {
         return null;
      }
      let plexDataJson = response.data;
      if (plexDataJson.MediaContainer.size > 0) {
         let plexMetadata = plexDataJson.MediaContainer.Metadata[0];

         if (plexMetadata.type === "movie" || plexMetadata.type === "episode") {
            let plexMoviesAndShowsData = processMetadata(plexMetadata);
            let tmdb = await tmdbData(plexMoviesAndShowsData.title);
            plexMoviesAndShowsData.backdropPath = `${TMDBImageBaseUrl}/t/p/original${tmdb?.results[0]?.backdrop_path}`;
            plexMoviesAndShowsData.posterPath = `${TMDBImageBaseUrl}/t/p/original${tmdb?.results[0]?.poster_path}`;
            plexMoviesAndShowsData.id = tmdb?.results[0]?.id;
            plexMoviesAndShowsData.adult = tmdb?.results[0]?.adult;
            plexMoviesAndShowsData.originalLanguage =
               tmdb?.results[0]?.original_language;
            plexMoviesAndShowsData.originalTitleTMDB =
               tmdb?.results[0]?.original_title;
            plexMoviesAndShowsData.overview = tmdb?.results[0]?.overview;
            plexMoviesAndShowsData.releaseDate = tmdb?.results[0]?.release_date;
            plexMoviesAndShowsData.titleTMDB = tmdb?.results[0]?.title;
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
      } else {
         let response = await axios.get(`${plexBaseUrl}/library/onDeck`, {
            headers: plexHeaders,
         });
         let plexDataJson = response.data;
         if (plexDataJson.MediaContainer.size > 0) {
            const plexMetadata = plexDataJson.MediaContainer.Metadata[0];

            if (
               plexMetadata.type === "movie" ||
               plexMetadata.type === "episode"
            ) {
               const plexMoviesAndShowsData = processMetadata(plexMetadata);
               const tmdb = await tmdbData(plexMoviesAndShowsData.title);
               plexMoviesAndShowsData.backdropPath = `${imageBaseUrl}/t/p/original${tmdb?.results[0]?.backdrop_path}`;
               plexMoviesAndShowsData.posterPath = `${imageBaseUrl}/t/p/original${tmdb?.results[0]?.poster_path}`;
               plexMoviesAndShowsData.id = tmdb?.results[0]?.id;
               plexMoviesAndShowsData.adult = tmdb?.results[0]?.adult;
               plexMoviesAndShowsData.originalLanguage =
                  tmdb?.results[0]?.original_language;
               plexMoviesAndShowsData.originalTitleTMDB =
                  tmdb?.results[0]?.original_title;
               plexMoviesAndShowsData.overview = tmdb?.results[0]?.overview;
               plexMoviesAndShowsData.releaseDate =
                  tmdb?.results[0]?.release_date;
               plexMoviesAndShowsData.titleTMDB = tmdb?.results[0]?.title;
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
         } else {
            let response = await axios.get(
               `${plexBaseUrl}/status/sessions/history/all`,
               { headers: plexHeaders },
            );
            let plexDataJson = response.data;
            if (plexDataJson.MediaContainer.size > 0) {
               const plexMetadata =
                  plexDataJson.MediaContainer.Metadata[
                     plexDataJson.MediaContainer.Metadata.length - 1
                  ];
               if (
                  plexMetadata.type === "movie" ||
                  plexMetadata.type === "episode"
               ) {
                  const plexMoviesAndShowsData = processMetadata(plexMetadata);
                  const tmdb = await tmdbData(plexMoviesAndShowsData.title);
                  plexMoviesAndShowsData.backdropPath = `${imageBaseUrl}/t/p/original${tmdb?.results[0]?.backdrop_path}`;
                  plexMoviesAndShowsData.posterPath = `${imageBaseUrl}/t/p/original${tmdb?.results[0]?.poster_path}`;
                  plexMoviesAndShowsData.id = tmdb?.results[0]?.id;
                  plexMoviesAndShowsData.adult = tmdb?.results[0]?.adult;
                  plexMoviesAndShowsData.originalLanguage =
                     tmdb?.results[0]?.original_language;
                  plexMoviesAndShowsData.originalTitleTMDB =
                     tmdb?.results[0]?.original_title;
                  plexMoviesAndShowsData.overview = tmdb?.results[0]?.overview;
                  plexMoviesAndShowsData.releaseDate =
                     tmdb?.results[0]?.release_date;
                  plexMoviesAndShowsData.titleTMDB = tmdb?.results[0]?.title;
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
         }
      }
   } catch (error) {
      return null;
   }
}
