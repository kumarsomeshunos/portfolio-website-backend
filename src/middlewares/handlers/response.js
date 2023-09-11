// Helper function (success and error)
export const errorResponse = (
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

export const successResponse = (
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
