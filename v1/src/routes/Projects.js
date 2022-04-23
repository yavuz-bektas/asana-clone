const express = require("express");
const { create, index, update, remove } = require("../controllers/Projects");
const authenticateToken = require("../middlewares/authenticate");
const router = express.Router();
const validate = require("../middlewares/validate");
const schemas = require("../validations/Projects");

router.route("/").get(authenticateToken, index);
router
  .route("/")
  .post(authenticateToken, validate(schemas.createValidation), create);

router
  .route("/:id")
  .patch(authenticateToken, validate(schemas.updateValidation), update);

router.route("/:id").delete(authenticateToken, remove);

module.exports = router;
