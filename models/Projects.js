/** @format */

const mongoose = require("mongoose");
const joi = require("joi");
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

function validationCreateNewProject(object) {
  const schema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    link: joi.string().required(),
    img: joi.string().required(),
  });
  return schema.validate(object);
}
function validationUpdateProject(object) {
  const schema = joi.object({
    title: joi.string(),
    description: joi.string(),
    link: joi.string(),
    img: joi.string(),
  });
  return schema.validate(object);
}
module.exports = {
  Project,
  validationCreateNewProject,
  validationUpdateProject,
};
