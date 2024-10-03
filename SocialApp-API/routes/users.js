var express = require("express");
var router = express.Router();

const passport = require("../appPassport");

const user_controller = require("../controllers/usercontroller");

router.post("/login", user_controller.login_user);

router.get("/logout", user_controller.logout_user);

router.get(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  user_controller.get_user
);

router.post(
  "/users/search",
  passport.authenticate("jwt", { session: false }),
  user_controller.search_users
);

router.post("/users/search/guest", user_controller.search_users_guest);

router.post("/user", user_controller.post_user);

router.put("/user/saveprofile", user_controller.put_user_profile);

router.delete(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  user_controller.delete_user
);

module.exports = router;
