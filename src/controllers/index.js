// All imports
import * as projectController from "./project/project.js";
import * as authController from "./auth/auth.js";
import * as baseController from "./base/base.js";
import * as blogController from "./blog/blog.js";
import * as updateController from "./update/update.js";
import * as contactController from "./contact/contact.js";
import * as quoteController from "./quote/quote.js";

const controller = {
   projectController,
   authController,
   baseController,
   blogController,
   updateController,
   contactController,
   quoteController,
};

export default controller;
