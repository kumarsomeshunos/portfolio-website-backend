// All imports
import Update from "../../models/update/update.js";

// MD to HTML ([temp] requirements)
import fs from "fs";

// Helper funciton (success and error)
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

// Fetch all updates
export function getAllUpdates(req, res) {
   try {
      let sortByDate = req.query?.sortByDate;
      sortByDate = sortByDate === "asc" ? 1 : sortByDate === "des" ? -1 : null;
      let limit = req.query?.limit;
      limit = limit === "all" ? null : parseInt(limit) ? parseInt(limit) : 5;

      Update.find()
         .sort({ postedOn: sortByDate })
         .limit(limit)
         .then(updates => {
            if (updates.length === 0) {
               return errorResponse(
                  res,
                  "No updates found :(",
                  "No updates found or an error occured while retrieving data :(",
                  1,
                  404,
               );
            }

            // MD to HTML (Temp)
            updates.map(update => {
               const mkdn = fs.readFileSync(update.descriptionMD, "utf8");
               update.descriptionMD = mkdn;
            });

            return successResponse(res, "Updates list :)", null, 2, 200, {
               count: updates.length,
               data: updates,
            });
         })
         .catch(error => {
            return errorResponse(
               res,
               "Casting failed :(",
               error.message,
               4,
               500,
               { fatal: true },
            );
         });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         5,
         500,
         { fatal: true },
      );
   }
}

// Create new udpate
export function newUpdate(req, res) {
   try {
      const { title, version } = req.body;

      const descriptionMD = !req.file
         ? null
         : `uploads/updates/${req.file?.filename}`;

      const newUpdateData = {
         descriptionMD,
         title,
         version,
      };
      new Update(newUpdateData)
         .save()
         .then(update => {
            return successResponse(res, "Update saved :)", null, 11, 201, {
               data: update,
            });
         })
         .catch(error => {
            return errorResponse(
               res,
               "Casting failed :(",
               error.message,
               12,
               500,
               { fatal: true },
            );
         });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         13,
         500,
         { fatal: true },
      );
   }
}

// Delete update
export function deleteUpdate(req, res) {
   try {
      if (req.query.all === "true") {
         Update.deleteMany({})
            .then(() => {
               return successResponse(
                  res,
                  "All updates deleted successfully :)",
                  null,
                  18,
                  200,
               );
            })
            .catch(error => {
               return errorResponse(
                  res,
                  "Internal server error :(",
                  error.message,
                  19,
                  500,
               );
            });
      } else {
         const id = req.params.id;
         Update.findByIdAndRemove(id)
            .then(deletedUpdate => {
               if (!deletedUpdate) {
                  return errorResponse(
                     res,
                     "Update not found.",
                     "The specified update does not exist.",
                     20,
                     404,
                  );
               }
               return successResponse(
                  res,
                  "Update deleted successfully.",
                  null,
                  21,
                  200,
                  { data: deletedUpdate },
               );
            })
            .catch(error => {
               return errorResponse(
                  res,
                  "Internal server error.",
                  error.message,
                  22,
                  500,
               );
            });
      }
   } catch (error) {
      return errorResponse(
         res,
         "Internal server error.",
         error.message,
         23,
         500,
      );
   }
}
