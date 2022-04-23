const express = require("express");
const {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update,
  remove,
  changePassword,
} = require("../controllers/Users");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Users");

router.get("/", index);
router.route("/").post(validate(schemas.createValidation), create);
router
  .route("/")
  .patch(authenticateToken, validate(schemas.updateValidation), update);
router.route("/login").post(validate(schemas.LoginValidation), login);
router.route("/projects").get(authenticateToken, projectList);
router
  .route("/reset-password")
  .post(validate(schemas.resetPasswordValidation), resetPassword);

router
  .route("/change-password")
  .post(
    authenticateToken,
    validate(schemas.changePasswordValidation),
    changePassword
  );

router.route("/:id").delete(authenticateToken, remove);
module.exports = router;
