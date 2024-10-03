var express = require("express");
var router = express.Router();

const message_controller = require("../controllers/messagecontroller");

const passport = require("../appPassport");

router.post(
  "/messages",
  passport.authenticate("jwt", { session: false }),
  message_controller.list_messages
);

router.get(
  "/message/likes/:id",
  passport.authenticate("jwt", { session: false }),
  message_controller.get_messagelikes
);

router.post(
  "/message",
  passport.authenticate("jwt", { session: false }),
  message_controller.post_message
);

router.post(
  "/message/like",
  passport.authenticate("jwt", { session: false }),
  message_controller.post_likemessage
);

router.put(
  "/message/:id",
  passport.authenticate("jwt", { session: false }),
  message_controller.put_message
);

router.delete(
  "/message/:id",
  passport.authenticate("jwt", { session: false }),
  message_controller.delete_message
);

router.delete(
  "/message/like/:id",
  passport.authenticate("jwt", { session: false }),
  message_controller.delete_likemessage
);

module.exports = router;
