var express = require("express");
var router = express.Router();

const post_controller = require("../controllers/postcontroller");

const passport = require("../appPassport");

router.get(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  post_controller.list_posts
);

router.get(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  post_controller.get_post
);

router.get(
  "/post/likes/:id",
  passport.authenticate("jwt", { session: false }),
  post_controller.get_postlikes
);

router.post(
  "/post",
  passport.authenticate("jwt", { session: false }),
  post_controller.post_post
);

router.post(
  "/post/like",
  passport.authenticate("jwt", { session: false }),
  post_controller.post_likepost
);

router.put(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  post_controller.put_post
);

router.delete(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  post_controller.delete_post
);

router.delete(
  "/post/like/:id",
  passport.authenticate("jwt", { session: false }),
  post_controller.delete_likepost
);

module.exports = router;
