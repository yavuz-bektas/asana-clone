const Project = require("../models/Projects");

const insert = (projectData) => {
  const project = new Project(projectData);
  return project.save();
};

const list = (where) => {
  return Project.find(where || {}).populate({
    path: "user_id",
    select: "full_name email profile_image",
  });
};

const modify = (id, data) => {
  const mydata = Project.findByIdAndUpdate(id, data, { new: true });
  return mydata;
};

const deleteProject = (id) => {
  return Project.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  modify,
  deleteProject,
};
