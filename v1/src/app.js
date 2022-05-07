const express = require("express");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const config = require("./config"); //env gibi bağımlılıkları çağır
const loaders = require("./loaders"); // mongodb connection çağır
const events = require("./scripts/events");
const { ProjectRouter, UsersRouter, SectionRouter } = require("./routes");
const path = require("path");

config();
loaders();
events();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")));
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.listen(process.env.APP_PORT, () => {
  console.log("Servis app is listening on port 3000");
  app.use("/projects", ProjectRouter);
  app.use("/users", UsersRouter);
  app.use("/sections", SectionRouter);
});
