// All imports
import Project from "./../../models/project/project.js";

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

// Fetch all projects
export function getAllProjects(req, res) {
   try {
      let sortByDate = req.query.sortByDate;
      sortByDate = sortByDate === "asc" ? 1 : sortByDate === "des" ? -1 : null;
      let sortByVC = req.query.sortByVC;
      sortByVC = sortByVC === "asc" ? 1 : sortByVC === "des" ? -1 : null;
      let limit = req.query.limit;
      limit = limit === "all" ? null : parseInt(limit) ? parseInt(limit) : 5;

      Project.find()
         .sort({ postedOn: sortByDate })
         .sort({ viewCount: sortByVC })
         .limit(limit)
         .then(projects => {
            if (projects.length === 0) {
               return errorResponse(
                  res,
                  "No projects found :(",
                  "No projects found or an error occured while retrieving data :(",
                  1,
                  404,
               );
            }
            return successResponse(res, "Projects list :)", null, 2, 200, {
               count: projects.length,
               data: projects,
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

// Fetch one specific project
export function getProject(req, res) {
   try {
      const id = req.params.id;
      Project.findById(id)
         .then(project => {
            if (!project) {
               return errorResponse(
                  res,
                  "Project not found :(",
                  `Project with id: ${id} not found :(`,
                  6,
                  404,
               );
            }
            return successResponse(res, "Project details :)", null, 7, 200, {
               data: project,
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

// Create new project
export function newProject(req, res) {
   try {
      const {
         author,
         carousol,
         codeName,
         description,
         endDate,
         isVisible,
         license,
         links,
         position,
         projectID,
         startDate,
         status,
         subtitle,
         thumbnail,
         technologies,
         title,
         version,
      } = req.body;

      const descriptionMD = !req.file ? null : `uploads/${req.file.filename}`;

      const parsedLinks = JSON.parse(`[${links}]`);
      const parsedTechnologies = JSON.parse(`[${technologies}]`);

      const newProjectData = {
         author,
         carousol,
         codeName,
         description,
         descriptionMD,
         endDate,
         isVisible,
         license,
         links: parsedLinks,
         position,
         projectID,
         startDate,
         status,
         subtitle,
         thumbnail,
         technologies: parsedTechnologies,
         title,
         version,
      };
      new Project(newProjectData)
         .save()
         .then(project => {
            return successResponse(res, "Project saved :)", null, 11, 201, {
               data: project,
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

// Update project
export function updateProject(req, res) {
   try {
      const id = req.params.id;
      const descriptionMD = !req.file ? null : `uploads/${req.file.filename}`;

      const parsedLinks = JSON.parse(`[${req.body.links}]`);
      const parsedTechnologies = JSON.parse(`[${req.body.technologies}]`);

      const updateData = {
         author: req.body.author,
         carousol: req.body.carousol,
         codeName: req.body.codeName,
         description: req.body.description,
         descriptionMD: descriptionMD,
         endDate: req.body.endDate,
         isVisible: req.body.isVisible,
         license: req.body.license,
         links: parsedLinks,
         position: req.body.position,
         projectID: req.body.projectID,
         startDate: req.body.startDate,
         status: req.body.status,
         subtitle: req.body.subtitle,
         thumbnail: req.body.thumbnail,
         technologies: parsedTechnologies,
         title: req.body.title,
         version: req.body.version,
      };

      Project.findByIdAndUpdate(id, updateData, { new: true })
         .then(updatedProject => {
            if (!updatedProject) {
               return errorResponse(
                  res,
                  "Project not found :(",
                  "The specified project does not exist :(",
                  14,
                  404,
               );
            }
            return successResponse(
               res,
               "Project updated successfully :)",
               null,
               15,
               200,
               { data: updatedProject },
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

// Delete project
export function deleteProject(req, res) {
   try {
      if (req.query.all === "true") {
         Project.deleteMany({})
            .then(() => {
               return successResponse(
                  res,
                  "All projects deleted successfully :)",
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
         Project.findByIdAndRemove(id)
            .then(deletedProject => {
               if (!deletedProject) {
                  return errorResponse(
                     res,
                     "Project not found.",
                     "The specified project does not exist.",
                     20,
                     404,
                  );
               }
               return successResponse(
                  res,
                  "Project deleted successfully.",
                  null,
                  21,
                  200,
                  { data: deletedProject },
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
