const mongoose = require("mongoose");
const logger = require("../scripts/logger/Projects");

const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true, versionKey: false }
);

// ProjectSchema.pre("save", (next, object) => {
//   console.log("öncesi", object);
//   next();
// });

ProjectSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});

module.exports = mongoose.model("project", ProjectSchema);
