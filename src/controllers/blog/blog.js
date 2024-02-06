// All imports
import Blog from "./../../models/blog/blog.js";

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

// Fetch all blogs
export function getAllBlogs(req, res) {
   try {
      let sortByDate = req.query?.sortByDate;
      sortByDate = sortByDate === "asc" ? 1 : sortByDate === "des" ? -1 : null;
      let sortByVC = req.query?.sortByVC;
      sortByVC = sortByVC === "asc" ? 1 : sortByVC === "des" ? -1 : null;
      let limit = req.query?.limit;
      limit = limit === "all" ? null : parseInt(limit) ? parseInt(limit) : 5;

      Blog.find()
         .sort({ postedOn: sortByDate })
         .sort({ viewCount: sortByVC })
         .limit(limit)
         .then(blogs => {
            if (blogs.length === 0) {
               return errorResponse(
                  res,
                  "No blogs found :(",
                  "No blogs found or an error occured while retrieving data :(",
                  1,
                  404,
               );
            }
            return successResponse(res, "Blogs list :)", null, 2, 200, {
               count: blogs.length,
               data: blogs,
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

// Fetch one specific blog
export function getBlog(req, res) {
   try {
      const id = req.params?.id;
      Blog.findById(id)
         .then(blog => {
            if (!blog) {
               return errorResponse(
                  res,
                  "Blog not found :(",
                  `Blog with id: ${id} not found :(`,
                  6,
                  404,
               );
            }

            // MD to HTML (Temp)
            const mkdn = fs.readFileSync(blog.descriptionMD, "utf8");
            blog.descriptionMD = mkdn;

            return successResponse(res, "Blog details :)", null, 7, 200, {
               data: blog,
            });
         })
         .catch(error => {
            return errorResponse(
               res,
               "Casting failed :(",
               error.message,
               8,
               500,
               { fatal: true },
            );
         });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         9,
         500,
         { fatal: true },
      );
   }
}

// Create new blog
export function newBlog(req, res) {
   try {
      const {
         author,
         carousol,
         slug,
         description,
         featuredThumbnail,
         isVisible,
         tags,
         position,
         blogID,
         subtitle,
         thumbnail,
         title,
      } = req.body;

      const descriptionMD = !req.file
         ? null
         : `uploads/blogs/${req.file?.filename}`;

      const parsedTags = JSON.parse(`[${tags}]`);

      const newBlogData = {
         author,
         carousol,
         slug,
         description,
         descriptionMD,
         featuredThumbnail,
         isVisible,
         tags: parsedTags,
         position,
         blogID,
         subtitle,
         thumbnail,
         title,
      };
      new Blog(newBlogData)
         .save()
         .then(blog => {
            return successResponse(res, "Blog saved :)", null, 11, 201, {
               data: blog,
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

// Update blog
export function updateBlog(req, res) {
   try {
      const id = req.params?.id;
      const descriptionMD = !req.file
         ? null
         : `uploads/blogs/${req.file?.filename}`;

      const parsedTags = JSON.parse(`[${req.body?.tags}]`);

      const updateData = {
         author: req.body?.author,
         carousol: req.body?.carousol,
         slug: req.body?.slug,
         description: req.body?.description,
         descriptionMD: descriptionMD,
         featuredThumbnail: req.body?.featuredThumbnail,
         isVisible: req.body?.isVisible,
         tags: parsedTags,
         position: req.body?.position,
         blogID: req.body?.blogID,
         subtitle: req.body?.subtitle,
         thumbnail: req.body?.thumbnail,
         title: req.body?.title,
      };

      Blog.findByIdAndUpdate(id, updateData, { new: true })
         .then(updatedBlog => {
            if (!updatedBlog) {
               return errorResponse(
                  res,
                  "Blog not found :(",
                  "The specified blog does not exist :(",
                  14,
                  404,
               );
            }
            return successResponse(
               res,
               "Blog updated successfully :)",
               null,
               15,
               200,
               { data: updatedBlog },
            );
         })
         .catch(error => {
            return errorResponse(
               res,
               "Internal server error :(",
               error.message,
               16,
               500,
            );
         });
   } catch (error) {
      return errorResponse(
         res,
         "Internal server error.",
         error.message,
         17,
         500,
      );
   }
}

// Delete blog
export function deleteBlog(req, res) {
   try {
      if (req.query.all === "true") {
         Blog.deleteMany({})
            .then(() => {
               return successResponse(
                  res,
                  "All blogs deleted successfully :)",
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
         Blog.findByIdAndRemove(id)
            .then(deletedBlog => {
               if (!deletedBlog) {
                  return errorResponse(
                     res,
                     "Blog not found.",
                     "The specified blog does not exist.",
                     20,
                     404,
                  );
               }
               return successResponse(
                  res,
                  "Blog deleted successfully.",
                  null,
                  21,
                  200,
                  { data: deletedBlog },
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
