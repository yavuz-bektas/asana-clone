const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const loaders = require("./loaders");

const { Routes } = require("./routes");

config();
loaders();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.APP_PORT, () => {
  console.log("Servis app is listening on port 3000");
  app.use("/projects", Routes);
});
