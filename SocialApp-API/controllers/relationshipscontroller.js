const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.get_relationship = asyncHandler(async (req, res, next) => {
  const relationship = await prisma.relationship.findFirst({
    where: {
      OR: [
        {
          user1Id: Number(req.body.user.id),
          user2Id: Number(req.body.profileUser.id),
        },
        {
          user1Id: Number(req.body.profileUser.id),
          user2Id: Number(req.body.user.id),
        },
      ],
    },
    select: {
      user1: true,
      user2: true,
      pending: true,
      accepted: true,
      blockeduser1: true,
      blockeduser2: true,
    },
  });
  if (relationship) {
    res.status(200).json({
      success: true,
      relationship: relationship,
    });
  } else {
    res.status(200).json({
      success: false,
      msg: "No relationships found for the two users",
    });
  }
});

exports.list_friends = asyncHandler(async (req, res, next) => {
  const friends = await prisma.relationship.findMany({
    where: {
      OR: [
        {
          user1Id: Number(req.params.id),
          accepted: true,
          pending: false,
          blockeduser1: false,
          blockeduser2: false,
        },
        {
          user2Id: Number(req.params.id),
          accepted: true,
          pending: false,
          blockeduser1: false,
          blockeduser2: false,
        },
      ],
    },
    select: {
      user1: true,
      user2: true,
    },
  });
  if (friends) {
    res.status(200).json({
      success: true,
      friends: friends,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting friends",
    });
  }
});

exports.list_friendrequests = asyncHandler(async (req, res, next) => {
  const friendrequests = await prisma.relationship.findMany({
    where: {
      OR: [
        {
          user1Id: Number(req.params.id),
          accepted: false,
          pending: true,
          blockeduser1: false,
          blockeduser2: false,
        },
        {
          user2Id: Number(req.params.id),
          accepted: false,
          pending: true,
          blockeduser1: false,
          blockeduser2: false,
        },
      ],
      NOT: {
        requestingUserId: Number(req.params.id),
      },
    },
    select: {
      user1: true,
      user2: true,
    },
  });
  if (friendrequests) {
    res.status(200).json({
      success: true,
      friendrequests: friendrequests,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting friendrequests",
    });
  }
});

exports.list_sentfriendrequests = asyncHandler(async (req, res, next) => {
  const friendrequests = await prisma.relationship.findMany({
    where: {
      OR: [
        {
          user1Id: Number(req.params.id),
          accepted: false,
          pending: true,
          requestingUserId: Number(req.params.id),
          blockeduser1: false,
          blockeduser2: false,
        },
        {
          user2Id: Number(req.params.id),
          accepted: false,
          pending: true,
          requestingUserId: Number(req.params.id),
          blockeduser1: false,
          blockeduser2: false,
        },
      ],
    },
    select: {
      user1: true,
      user2: true,
    },
  });
  if (friendrequests) {
    res.status(200).json({
      success: true,
      friendrequests: friendrequests,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting sent friendrequests",
    });
  }
});

exports.list_blockedusers = asyncHandler(async (req, res, next) => {
  const blockedList = await prisma.relationship.findMany({
    where: {
      OR: [
        {
          user2Id: Number(req.params.id),
          blockeduser1: true,
        },
        {
          user1Id: Number(req.params.id),
          blockeduser2: true,
        },
      ],
    },
    select: {
      user1: true,
      user2: true,
    },
  });
  if (blockedList) {
    res.status(200).json({
      success: true,
      blockedList: blockedList,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error blocking user",
    });
  }
});

exports.post_sendrequest = asyncHandler(async (req, res, next) => {
  const relationshipAlreadyExists = await prisma.relationship.findFirst({
    where: {
      OR: [
        { user1Id: req.body.user.id, user2Id: req.body.contact.id },
        { user1Id: req.body.contact.id, user2Id: req.body.user.id },
      ],
    },
  });

  if (relationshipAlreadyExists) {
    console.log("already ecists");
    res.status(200).json({
      success: false,
      msg: "A relationship already exists between the requesting user and the user sent a friend request",
    });
  } else {
    const newRelationship = await prisma.relationship.create({
      data: {
        user1Id: req.body.user.id,
        user2Id: req.body.contact.id,
        requestingUserId: req.body.user.id,
        pending: true,
        accepted: false,
        blockeduser1: false,
        blockeduser2: false,
      },
    });
    if (newRelationship) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Unknown error sending friend request",
      });
    }
  }
});

exports.put_blockfriend = asyncHandler(async (req, res, next) => {
  const relationship = await prisma.relationship.findFirst({
    where: {
      OR: [
        {
          user1Id: Number(req.body.user.id),
          user2Id: Number(req.body.friend.id),
          blockeduser1: false,
          blockeduser2: false,
        },
        {
          user2Id: Number(req.body.user.id),
          user1Id: Number(req.body.friend.id),
          blockeduser1: false,
          blockeduser2: false,
        },
      ],
    },
    select: {
      user1: true,
      user2: true,
      id: true,
    },
  });

  var blockFriend = null;
  if (relationship.user1.id === req.body.user.id) {
    blockFriend = await prisma.relationship.update({
      where: {
        id: Number(relationship.id),
      },

      data: {
        blockeduser2: true,
      },
    });
  } else if (relationship.user2.id === req.body.user.id) {
    blockFriend = await prisma.relationship.update({
      where: {
        id: Number(relationship.id),
      },

      data: {
        blockeduser1: true,
      },
    });
  }
  if (blockFriend) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error blocking user",
    });
  }
});

exports.put_unblockfriend = asyncHandler(async (req, res, next) => {
  const relationship = await prisma.relationship.findFirst({
    where: {
      OR: [
        {
          user1Id: Number(req.body.user.id),
          user2Id: Number(req.body.blockedUser.id),
          blockeduser1: false,
          blockeduser2: true,
        },
        {
          user2Id: Number(req.body.user.id),
          user1Id: Number(req.body.blockedUser.id),
          blockeduser1: true,
          blockeduser2: false,
        },
      ],
    },
    select: {
      user1: true,
      user2: true,
      id: true,
    },
  });
  var unblockFriend = null;
  if (relationship.user1.id === req.body.user.id) {
    unblockFriend = await prisma.relationship.update({
      where: {
        id: relationship.id,
      },

      data: {
        blockeduser2: false,
      },
    });
  } else if (relationship.user2.id === req.body.user.id) {
    unblockFriend = await prisma.relationship.update({
      where: {
        id: relationship.id,
      },

      data: {
        blockeduser1: false,
      },
    });
  }

  if (unblockFriend) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error unblocking user",
    });
  }
});

exports.put_acceptrequest = asyncHandler(async (req, res, next) => {
  const friendRequest = await prisma.relationship.findFirst({
    where: {
      OR: [
        {
          user1Id: Number(req.body.user.id),
          user2Id: Number(req.body.friend.id),
          blockeduser1: false,
          blockeduser2: false,
          pending: true,
          accepted: false,
        },
        {
          user2Id: Number(req.body.user.id),
          user1Id: Number(req.body.friend.id),
          blockeduser1: false,
          blockeduser2: false,
          pending: true,
          accepted: false,
        },
      ],
    },
    select: { id: true, user1: true, user2: true },
  });

  const acceptRequest = await prisma.relationship.update({
    where: {
      id: Number(friendRequest.id),
    },
    data: { pending: false, accepted: true },
  });

  if (acceptRequest) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting accepting friend request",
    });
  }
});

exports.delete_friendship = asyncHandler(async (req, res, next) => {
  const friendshipToDelete = await prisma.relationship.findFirst({
    where: {
      OR: [
        {
          user1Id: Number(req.body.user.id),
          user2Id: Number(req.body.friend.id),
        },
        {
          user2Id: Number(req.body.user.id),
          user1Id: Number(req.body.friend.id),
        },
      ],
    },
  });
  const deleteRelationship = await prisma.relationship.delete({
    where: {
      id: Number(friendshipToDelete.id),
    },
  });
  if (deleteRelationship) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error deleting friendship",
    });
  }
});
