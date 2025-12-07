/** @format */

const serverless = require("serverless-http");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const { notFound, errorHandler } = require("./middlewares/errorsHandler");
const asyncHandler = require("express-async-handler");
const cors = require("cors");
const path = require("path");
const {
  Project,
  validationCreateNewProject,
  validationUpdateProject,
} = require("./models/Projects");
app.use(cors());
const connectToDb = require("./config/db");

require("dotenv").config();
// CONNECT TO DB
app.use(express.json());
console.log("this is my file");
connectToDb();

app.get(
  "/api/projects",
  asyncHandler(async (req, res) => {
    const projectsList = await Project.find();
    res.status(200).json(projectsList);
  })
);
app.post(
  "/api/projects",
  asyncHandler(async (req, res) => {
    const { error } = validationCreateNewProject(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      img: req.body.img,
    });
    const result = await project.save();
    res.status(201).json(result);
  })
);

app.put(
  "/api/projects/:id",
  asyncHandler(async (req, res) => {
    const { error } = validationUpdateProject(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedproject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          link: req.body.link,
          img: req.body.img,
        },
      },
      { new: true }
    );

    if (!updatedproject) {
      return res.status(404).json({ message: "Project is not found" });
    }
    res.status(200).json(updatedproject);
  })
);

app.delete(
  "/api/projects/:id",
  asyncHandler(async (req, res) => {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project is not found" });
    }
    res
      .status(200)
      .json({ message: "the project has been deleted successfully" });
  })
);
app.use(notFound);
app.use(errorHandler);

const handler = serverless(app);
module.exports = handler;
