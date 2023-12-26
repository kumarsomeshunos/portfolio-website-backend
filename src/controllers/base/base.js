// All imports
import Base from "./../../models/base/base.js";
import { liveMoviesAndShows } from "../../services/plex/liveMoviesAndShows.js";
import { deckMoviesAndShows } from "../../services/plex/deckMoviesAndShows.js";
import { historyMoviesAndShows } from "../../services/plex/historyMoviesAndShows.js";

// MD to HTML ([temp] requirements)
import fs from "fs";

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

// CRUD

// Fetch all bases
export async function getAllBases(req, res) {
   try {
      // Fetch plex data
      // let plexData = await liveMoviesAndShows();
      // if (!plexData) {
      //    plexData = await deckMoviesAndShows();
      //    if (!plexData) {
      //       plexData = await historyMoviesAndShows();
      //       if(!plexData) {
      //          plexData = null;
      //       }
      //    }
      // }
      let plexData = null;
      // Spits out only one base (the latest one) if parameter is set to all then it spits out all the bases
      let sortByDate = req.query?.sortByDate;
      sortByDate = sortByDate === "asc" ? 1 : sortByDate === "des" ? -1 : -1;
      let limit = req.query?.limit;
      limit = limit === "all" ? null : parseInt(limit) ? parseInt(limit) : 1;

      Base.find()
         .sort({ postedOn: sortByDate })
         .limit(limit)
         .then(bases => {
            if (bases.length === 0) {
               return errorResponse(
                  res,
                  "No bases found :(",
                  "No bases found or an error occured while retrieving data :(",
                  31,
                  404,
               );
            }

            // MD to HTML (Temp)
            const mkdn = fs.readFileSync(bases[0].introductionMD, "utf8");
            bases[0].introductionMD = mkdn;

            return successResponse(res, "Bases list :)", null, 2, 200, {
               count: bases.length,
               data: bases,
               plexData: plexData,
            });
         })
         .catch(error => {
            return errorResponse(
               res,
               "Casting failed :(",
               error.message,
               34,
               500,
               { fatal: true },
            );
         });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         35,
         500,
         { fatal: true },
      );
   }
}

// Fetch one specific base
export async function getBase(req, res) {
   try {
      const id = req.params?.id;
      // Fetch plex data
      // let plexData = await liveMoviesAndShows();
      // if (!plexData) {
      //    plexData = await deckMoviesAndShows();
      //    if (!plexData) {
      //       plexData = await historyMoviesAndShows();
      //    }
      // }
      let plexData = null;
      Base.findById(id)
         .then(base => {
            if (!base) {
               return errorResponse(
                  res,
                  "Base not found :(",
                  `Base with id: ${id} not found :(`,
                  36,
                  404,
               );
            }

            // MD to HTML (Temp)
            const mkdn = fs.readFileSync(base.introductionMD, "utf8");
            base.introductionMD = mkdn;

            return successResponse(res, "Base details :)", null, 37, 200, {
               data: base,
               plexData: plexData,
            });
         })
         .catch(error => {
            return errorResponse(
               res,
               "Casting failed :(",
               error.message,
               38,
               500,
               { fatal: true },
            );
         });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         39,
         500,
         { fatal: true },
      );
   }
}

// Create new base
export function newBase(req, res) {
   try {
      const {
         greetings,
         name,
         displayProfile,
         heroButtons,
         navbarLinks,
         sectionOneHeading,
         sectionOneSubHeading,
         sectionOneButtons,
         sectionTwoHeading,
         sectionTwoSubHeading,
         sectionTwoButtons,
         socialLinks,
         endComment,
      } = req.body;

      const introductionMD = !req.file
         ? null
         : `uploads/bases/introduction/${req.file?.filename}`;

      const parsedNavbarLinks = JSON.parse(`[${navbarLinks}]`);
      const parsedHeroButtons = JSON.parse(`[${heroButtons}]`);
      const parsedsectionOneButtons = JSON.parse(`[${sectionOneButtons}]`);
      const parsedSectionTwoButtons = JSON.parse(`[${sectionTwoButtons}]`);
      const parsedSocialLinks = JSON.parse(`[${socialLinks}]`);

      const newBaseData = new Base({
         navbarLinks: parsedNavbarLinks,
         greetings,
         name,
         displayProfile,
         introductionMD,
         heroButtons: parsedHeroButtons,
         sectionOneHeading,
         sectionOneSubHeading,
         sectionOneButtons: parsedsectionOneButtons,
         sectionTwoHeading,
         sectionTwoSubHeading,
         sectionTwoButtons: parsedSectionTwoButtons,
         socialLinks: parsedSocialLinks,
         endComment,
      });

      newBaseData
         .save()
         .then(base => {
            return successResponse(res, "Base saved :)", null, 40, 201, {
               data: base,
            });
         })
         .catch(error => {
            return errorResponse(
               res,
               "Casting failed :(",
               error.message,
               41,
               500,
               { fatal: true },
            );
         });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         42,
         500,
         { fatal: true },
      );
   }
}

// Update base
export function updateBase(req, res) {
   try {
      const id = req.params?.id;

      const introductionMD = !req.file
         ? null
         : `uploads/bases/introduction/${req.file?.filename}`;

      const parsedNavbarLinks = JSON.parse(`[${req.body?.navbarLinks}]`);
      const parsedHeroButtons = JSON.parse(`[${req.body?.heroButtons}]`);
      const parsedsectionOneButtons = JSON.parse(
         `[${req.body?.sectionOneButtons}]`,
      );
      const parsedSectionTwoButtons = JSON.parse(
         `[${req.body?.sectionTwoButtons}]`,
      );
      const parsedSocialLinks = JSON.parse(`[${req.body?.socialLinks}]`);

      const updateData = {
         greetings: req.body?.greetings,
         name: req.body?.name,
         displayProfile: req.body?.displayProfile,
         introductionMD: introductionMD,
         heroButtons: parsedHeroButtons,
         navbarLinks: parsedNavbarLinks,
         sectionOneHeading: req.body?.sectionOneHeading,
         sectionOneSubHeading: req.body?.sectionOneSubHeading,
         sectionOneButtons: parsedsectionOneButtons,
         sectionTwoHeading: req.body?.sectionTwoHeading,
         sectionTwoSubHeading: req.body?.sectionTwoSubHeading,
         sectionTwoButtons: parsedSectionTwoButtons,
         socialLinks: parsedSocialLinks,
         endComment: req.body?.endComment,
      };

      Base.findByIdAndUpdate(id, updateData, { new: true })
         .then(updatedBase => {
            if (!updatedBase) {
               return errorResponse(
                  res,
                  "Base not found :(",
                  "The specified base does not exist :(",
                  43,
                  404,
               );
            }
            return successResponse(
               res,
               "Base updated successfully :)",
               null,
               44,
               200,
               { data: updatedBase },
            );
         })
         .catch(error => {
            return errorResponse(
               res,
               "Internal server error :(",
               error.message,
               45,
               500,
            );
         });
   } catch (error) {
      return errorResponse(
         res,
         "Internal server error.",
         error.message,
         46,
         500,
      );
   }
}

// Delete base
export function deleteBase(req, res) {
   try {
      if (req.query.all === "true") {
         Base.deleteMany({})
            .then(() => {
               return successResponse(
                  res,
                  "All bases deleted successfully :)",
                  null,
                  47,
                  200,
               );
            })
            .catch(error => {
               return errorResponse(
                  res,
                  "Internal server error :(",
                  error.message,
                  48,
                  500,
               );
            });
      } else {
         const id = req.params.id;
         Base.findByIdAndRemove(id)
            .then(deletedBase => {
               if (!deletedBase) {
                  return errorResponse(
                     res,
                     "Base not found.",
                     "The specified base does not exist.",
                     49,
                     404,
                  );
               }
               return successResponse(
                  res,
                  "Base deleted successfully.",
                  null,
                  50,
                  200,
                  { data: deletedBase },
               );
            })
            .catch(error => {
               return errorResponse(
                  res,
                  "Internal server error.",
                  error.message,
                  51,
                  500,
               );
            });
      }
   } catch (error) {
      return errorResponse(
         res,
         "Internal server error.",
         error.message,
         52,
         500,
      );
   }
}
