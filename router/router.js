const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const UserController = require("../controllers/UserController");
const FriendsController = require("../controllers/FriendsController");

router.use((req, res, next) => {
  if (req.path === "/signup") {
    next();
  } else {
    verifyToken(req, res, next);
  }
});

// User Controller
router.route("/signup").post(UserController.signup);
router.route("/login").post(UserController.login);

// Friends Controller
router.route("/add-friend").post(FriendsController.addFriend);
router.route("/friends-list").get(FriendsController.FriendsList);
router.route("/accept-request").post(FriendsController.acceptRequest);


module.exports = router;
