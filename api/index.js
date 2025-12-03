/** @format */

const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const { notFound, errorHandler } = require("../middlewares/errorsHandler");
const asyncHandler = require("express-async-handler");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const {
  Project,
  validationCreateNewProject,
  validationUpdateProject,
} = require("../models/Projects");
const connectToDb = require("../config/db");
const { json } = require("stream/consumers");

require("dotenv").config();
// CONNECT TO DB
connectToDb();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());
console.log("this is my file");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.get(
  "/api/projects",
  asyncHandler(async (req, res) => {
    const projectsList = await Project.find();
    res.status(200).json(projectsList);
  })
);

app.post(
  "/api/projects",
  upload.single("img"),
  asyncHandler(async (req, res) => {
    const projectData = JSON.parse(req.body.project);
    const { error } = validationCreateNewProject(projectData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, description, link } = projectData;
    const project = new Project({
      title,
      description,
      link,
      img: req.file ? "/uploads/" + req.file.filename : null,
    });
    const result = await project.save();
    res.status(201).json(result);
  })
);

app.put(
  "/api/projects/:id",
  upload.single("img"),
  asyncHandler(async (req, res) => {
    const projectData = JSON.parse(req.body.project);
    const { error } = validationUpdateProject(projectData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, description, link } = projectData;
    const updatedproject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          description,
          link,
          img: req.file ? "/uploads/" + req.file.filename : projectData.img,
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


module.exports = app;