var express = require("express");
var router = express.Router();

const comment_controller = require("../controllers/commentcontroller");

const passport = require("../appPassport");

router.get(
  "/comments/:id",
  passport.authenticate("jwt", { session: false }),
  comment_controller.list_comments
);

router.get(
  "/comment/likes/:id",
  passport.authenticate("jwt", { session: false }),
  comment_controller.get_commentlikes
);

router.post(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  comment_controller.post_comment
);

router.post(
  "/comment/like",
  passport.authenticate("jwt", { session: false }),
  comment_controller.post_likecomment
);

router.put(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  comment_controller.put_comment
);

router.delete(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  comment_controller.delete_comment
);

router.delete(
  "/comment/likes/:id",
  passport.authenticate("jwt", { session: false }),
  comment_controller.delete_likecomment
);

module.exports = router;
