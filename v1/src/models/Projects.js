const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

ProjectSchema.pre("save", (next) => {
  // console.log("öncesi", object);
  next();
});

ProjectSchema.post("save", (object) => {
  console.log("sonrasi", object);
});

module.exports = mongoose.model("project", ProjectSchema);
