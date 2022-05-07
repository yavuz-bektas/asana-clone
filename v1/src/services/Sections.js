const Section = require("../models/Sections");
const ModelUsers = require("../models/Users");
const ModelProjects = require("../models/Projects");

const insert = (SectionData) => {
  const section = new Section(SectionData);
  return section.save();
};

const list = (where) => {
  return Section.find(where || {})
    .populate({
      path: "user_id",
      select: "full_name email profile_image",
      model: ModelUsers,
    })
    .populate({
      path: "project_id",
      select: "name",
      model: ModelProjects,
    });
};

const modify = (id, data) => {
  const mydata = Section.findByIdAndUpdate(id, data, { new: true });
  return mydata;
};

const deleteSection = (id) => {
  return Section.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  modify,
  deleteSection,
};
