const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send({
    message: "rest api ayakta",
  });
});



app.listen(3232, () => {
  console.log("sunucu 3232 den calisiyor");
});
