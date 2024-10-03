var express = require("express");
var router = express.Router();

const relationship_controller = require("../controllers/relationshipscontroller");

const passport = require("../appPassport");

router.get(
  "/friends/:id",
  passport.authenticate("jwt", { session: false }),
  relationship_controller.list_friends
);

router.get(
  "/friends/requests/:id",
  passport.authenticate("jwt", { session: false }),
  relationship_controller.list_friendrequests
);

router.get(
  "/friends/sent-requests/:id",
  passport.authenticate("jwt", { session: false }),
  relationship_controller.list_sentfriendrequests
);

router.get(
  "/friends/blocked/:id",
  passport.authenticate("jwt", { session: false }),
  relationship_controller.list_blockedusers
);

router.post(
  "/relationship",
  passport.authenticate("jwt", { session: false }),
  relationship_controller.get_relationship
);

router.post(
  "/friend/request",
  passport.authenticate("jwt", { session: false }),
  relationship_controller.post_sendrequest
);

router.put(
  "/friend/acceptrequest",
  passport.authenticate("jwt", { session: false }),
  relationship_controller.put_acceptrequest
);

router.put(
  "/friend/block",
  passport.authenticate("jwt", { session: false }),
  relationship_controller.put_blockfriend
);

router.put(
  "/friend/unblock",
  passport.authenticate("jwt", { session: false }),
  relationship_controller.put_unblockfriend
);

router.delete(
  "/friend/unfriend",
  passport.authenticate("jwt", { session: false }),
  relationship_controller.delete_friendship
);

module.exports = router;
