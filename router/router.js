const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

router.use((req, res, next) => {
  if (req.path === "/signup") {
    next();
  } else {
    verifyToken(req, res, next);
  }
});

router.route("/signup").post(UserController.signup);
router.route("/login").post(UserController.login);

module.exports = router;
