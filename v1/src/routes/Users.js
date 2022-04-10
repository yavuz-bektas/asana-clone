const express = require("express");
const { create, index, login, projectList } = require("../controllers/Users");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Users");

router.get("/", index);
router.route("/").post(validate(schemas.createValidation), create);
router.route("/login").post(validate(schemas.LoginValidation), login);
router.route("/projects").get(authenticateToken, projectList);

module.exports = router;
