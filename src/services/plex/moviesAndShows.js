export async function moviesAndShows() {
   // Variables
   let plexBaseUrl = process.env.PLEX_BASE_URL;
   let plexToken = process.env.PLEX_TOKEN;

   // Header for plex
   let plexHeaders = {
      "X-Plex-Token": plexToken,
      Accept: "application/json",
   };

   let TMDBBaseUrl = process.env?.TMDB_API_BASE_URL;
   let TMDBImageBaseUrl = process.env?.TMDB_API_IMAGE_BASE_URL;

   let TMDBHeaders = {
      Accept: "application/json",
      Authorization: process.env?.TMDB_AUTHORIZATION_KEY,
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
   //    let tmdbData = async query => {
   //       try {
   //          let encodedQuery = encodeURIComponent(query);
   //          let tmdb = await fetch(
   //             `${TMDBBaseUrl}/search/movie?query=${encodedQuery}&include_adult=true&language=en-US&page=1`,
   //             { headers: TMDBHeaders },
   //          );

   //          if (tmdb.status !== 200) {
   //             console.error("5");
   //             return null;
   //          }
   //          let TMDBDataJson = await tmdb.json();
   //          return TMDBDataJson;
   //       } catch (error) {
   //          console.error("6");
   //          return null;
   //       }
   //    };

   // Fetch all movies
   try {
      let plexData = await fetch(`${plexBaseUrl}/status/sessions`, {
         headers: plexHeaders,
      });
      if (plexData.status !== 200) {
         console.log("1");
         return null;
      }
      let plexDataJson = await plexData.json();
      if (plexDataJson.MediaContainer.size > 0) {
         let plexMetadata = plexDataJson.MediaContainer.Metadata[0];

         if (plexMetadata.type === "movie" || plexMetadata.type === "episode") {
            let plexMoviesAndShowsData = processMetadata(plexMetadata);
            let tmdb = null;
            // let tmdb = await tmdbData(plexMoviesAndShowsData.title);
            // plexMoviesAndShowsData.backdropPath = `${TMDBImageBaseUrl}/t/p/original${tmdb?.results[0]?.backdrop_path}`;
            // plexMoviesAndShowsData.posterPath = `${TMDBImageBaseUrl}/t/p/original${tmdb?.results[0]?.poster_path}`;
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
         let plexData = await fetch(`${plexBaseUrl}/library/onDeck`, {
            headers: plexHeaders,
         });
         let plexDataJson = await plexData.json();

         if (plexDataJson.MediaContainer.size > 0) {
            const plexMetadata = plexDataJson.MediaContainer.Metadata[0];

            if (
               plexMetadata.type === "movie" ||
               plexMetadata.type === "episode"
            ) {
               const plexMoviesAndShowsData = processMetadata(plexMetadata);
               const tmdb = null;
               //    const tmdb = await tmdbData(plexMoviesAndShowsData.title);
               //    plexMoviesAndShowsData.backdropPath = `${imageBaseUrl}/t/p/original${tmdb?.results[0]?.backdrop_path}`;
               //    plexMoviesAndShowsData.posterPath = `${imageBaseUrl}/t/p/original${tmdb?.results[0]?.poster_path}`;
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
               return processMetadata(plexMetadata);
            }
         } else {
            let plexData = await fetch(
               `${plexBaseUrl}/status/sessions/history/all`,
               { headers: plexHeaders },
            );
            let plexDataJson = await plexData.json();

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
                  const tmdb = null;
                  //   const tmdb = await tmdbData(plexMoviesAndShowsData.title);
                  //   plexMoviesAndShowsData.backdropPath = `${imageBaseUrl}/t/p/original${tmdb?.results[0]?.backdrop_path}`;
                  //   plexMoviesAndShowsData.posterPath = `${imageBaseUrl}/t/p/original${tmdb?.results[0]?.poster_path}`;
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
                  return processMetadata(plexMetadata);
               }
            }
         }
      }
   } catch (error) {
      console.log(error);
      console.log("2");
      return null;
   }
}
