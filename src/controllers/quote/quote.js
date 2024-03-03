// All imports
import Quote from "../../models/quote/quote.js";

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

// Fetch all quotes
export async function getAllQuotes(req, res) {
   try {
      let sortByDate = req.query?.sortByDate;
      sortByDate = sortByDate === "asc" ? 1 : sortByDate === "des" ? -1 : null;
      let limit = req.query?.limit;
      limit = limit === "all" ? null : parseInt(limit) ? parseInt(limit) : 5;
      // Fetch quote from database
      // Spits out only one quote (the latest one); if parameter is set to all then it spits out all the quotes
      Quote.find()
         .sort({ postedOn: sortByDate })
         .limit(limit)
         .then(quotes => {
            if (quotes.length === 0) {
               return errorResponse(
                  res,
                  "No quotes found :(",
                  "No quotes found or an error occured while retrieving data :(",
                  51,
                  404,
               );
            }

            return successResponse(res, "Quotes list :)", null, 2, 200, {
               count: quotes.length,
               data: quotes,
            });
         })
         .catch(error => {
            return errorResponse(
               res,
               "Casting failed :(",
               error.message,
               54,
               500,
               { fatal: true },
            );
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

// Fetch random quote
export async function getRandomQuote(req, res) {
   try {
      const count = await Quote.countDocuments();
      const random = Math.floor(Math.random() * count);
      Quote.findOne()
         .skip(random)
         .then(quote => {
            if (!quote) {
               return errorResponse(
                  res,
                  "No quotes found :(",
                  "No quotes found or an error occured while retrieving data :(",
                  51,
                  404,
               );
            }
            return successResponse(res, "Random Quote :)", null, 2, 200, {
               data: quote,
            });
         })
         .catch(error => {
            return errorResponse(
               res,
               "Casting failed :(",
               error.message,
               54,
               500,
               { fatal: true },
            );
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

// Fetch one specific quote
export async function getQuote(req, res) {
   try {
      const id = req.params?.id;
      Quote.findById(id).then(quote => {
         if (!quote) {
            return errorResponse(
               res,
               "Quote not found :(",
               `Quote with id: ${id} not found :(`,
               56,
               404,
            );
         }
         return successResponse(res, "Quote details :)", null, 57, 200, {
            data: quote,
         });
      });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         58,
         500,
         { fatal: true },
      );
   }
}

// Create new quote
export function newQuote(req, res) {
   try {
      const { quote, author, source, context, personalNotes, tags } = req.body;
      const newQuoteData = new Quote({
         quote,
         author,
         source,
         context,
         personalNotes,
         tags,
      });
      newQuoteData
         .save()
         .then(quote => {
            return successResponse(res, "Quote saved :)", null, 59, 201, {
               data: quote,
            });
         })
         .catch(error => {
            return errorResponse(
               res,
               "Casting failed :(",
               error.message,
               60,
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

// Update quote
export function updateQuote(req, res) {
   try {
      const id = req.params?.id;
      const { quote, author, source, context, personalNotes, tags } = req.body;
      const updateData = {
         quote,
         author,
         source,
         context,
         personalNotes,
         tags,
      };
      Quote.findByIdAndUpdate(id, updateData, { new: true })
         .then(updatedQuote => {
            if (!updatedQuote) {
               return errorResponse(
                  res,
                  "Quote not found :(",
                  "The specified quote does not exist :(",
                  61,
                  404,
               );
            }
            return successResponse(
               res,
               "Quote updated successfully :)",
               null,
               62,
               200,
               { data: updatedQuote },
            );
         })
         .catch(error => {
            return errorResponse(
               res,
               "Internal server error :(",
               error.message,
               63,
               500,
            );
         });
   } catch (error) {
      return errorResponse(
         res,
         "Internal server error.",
         error.message,
         64,
         500,
      );
   }
}

// Delete quote
export function deleteQuote(req, res) {
   try {
      if (req.query.all === "true") {
         Quote.deleteMany({})
            .then(() => {
               return successResponse(
                  res,
                  "All quotes deleted successfully :)",
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
         Quote.findByIdAndRemove(id)
            .then(deletedQuote => {
               if (!deletedQuote) {
                  return errorResponse(
                     res,
                     "Quote not found.",
                     "The specified quote does not exist.",
                     49,
                     404,
                  );
               }
               return successResponse(
                  res,
                  "Quote deleted successfully.",
                  null,
                  50,
                  200,
                  { data: deletedQuote },
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
