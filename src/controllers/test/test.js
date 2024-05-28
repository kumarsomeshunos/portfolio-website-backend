// All imports
import { promises as fs } from "fs";
import { lastfmTopTracks } from "../../services/lastfm/lastfmTopTracks.js";

// Helper function (success and error)
const errorResponse = (
   res,
   message,
   errorMessage,
   errorCode,
   statusCode = 500,
   extraFields = null,
) => {
   const response = {
      statusCode,
      errorCode,
      success: false,
      message,
      errorMessage,
      ...(extraFields || {}),
   };
   return res.status(statusCode).json(response);
};

const successResponse = (
   res,
   message,
   successMessage,
   successCode,
   statusCode = 200,
   extraFields = null,
) => {
   const response = {
      statusCode,
      successCode,
      success: true,
      message,
      successMessage,
      ...(extraFields || {}),
   };
   return res.status(statusCode).json(response);
};

// Anything related to testing goes here...

/*
Initialization of the server
   Currently: Only runs the topTracks function which fetches 
            the top tracks from lastfm 
            and stores them in the TopTracks.json file.
*/

export async function initialize(req, res) {
   try {
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong while initializing :(",
         error.message,
         45,
         500,
         { fatal: true },
      );
   }
}

/* 
Fetches the top tracks from lastfm also with their spotify links and 
returns them organised in a JSON file named TopTracks.json
If data already exists in the file, it returns the cached data.
*/
export async function topTracks(req, res) {
   try {
      lastfmTopTracks(10).then(data => {
         return successResponse(res, "LastFM top tracks :)", null, 2, 200, {
            data,
         });
      });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         55,
         500,
         { fatal: true },
      );
   }
}

export async function readTopTracks(req, res) {
   try {
      fs.access("TopTracks.json").catch(error => {
         return topTracks(req, res);
      });
      const stats = await fs.stat("TopTracks.json");
      if (stats.size > 0) {
         const data = await fs.readFile("TopTracks.json", "utf8");
         const json = JSON.parse(data);
         return successResponse(
            res,
            "LastFM top tracks (cached data) :)",
            null,
            1,
            200,
            {
               data: json,
            },
         );
      } else {
         return topTracks(req, res);
      }
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         55,
         500,
         { fatal: true },
      );
   }
}
