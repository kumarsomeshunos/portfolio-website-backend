import postmark from "postmark";

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

// Contact form

export async function contact(req, res) {
   try {
      const { name, email, message } = req.body;
      console.log(name, email, message);
      console.log(
         process.env?.POSTMARK_KEY,
         process.env?.POSTMARK_EMAIL_FROM,
         process.env?.POSTMARK_EMAIL_TO,
      );
      let client = await new postmark.ServerClient(process.env?.POSTMARK_KEY);

      client
         .sendEmail({
            From: process.env?.POSTMARK_EMAIL_FROM,
            To: process.env?.POSTMARK_EMAIL_TO,
            Subject: `PCF: Message from ${name} | (${email})`,
            TextBody: message,
         })
         .then(response => {
            console.log(response);
            return successResponse(
               res,
               "Email sent successfully :)",
               response.message,
               3,
               200,
            );
         })
         .catch(error => {
            return errorResponse(
               res,
               "Email was not sent :(",
               error.message,
               5,
               500,
               { fatal: false },
            );
         });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         5,
         500,
         { fatal: false },
      );
   }
}
