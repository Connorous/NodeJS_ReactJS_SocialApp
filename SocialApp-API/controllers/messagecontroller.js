const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.list_messages = asyncHandler(async (req, res, next) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: req.body.userId,
          receiverId: req.body.contactId,
        },
        {
          receiverId: req.body.userId,
          senderId: req.body.contactId,
        },
      ],
    },
    select: {
      id: true,
      dateCreated: true,
      content: true,
      senderId: true,
      sender: true,
      receiverId: true,
      receiver: true,
      likes: true,
    },
    orderBy: [
      {
        dateCreated: "asc",
      },
    ],
  });
  if (messages) {
    res.status(200).json({
      success: true,
      messages: messages,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting messages",
    });
  }
});

exports.post_message = [
  body("content", "content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        msg: "Message provided was invalid",
      });
    } else {
      const newMessage = await prisma.message.create({
        data: {
          content: req.body.content,
          senderId: req.body.senderId,
          receiverId: req.body.receiverId,
        },
      });
      if (newMessage) {
        res.status(200).json({
          success: true,
          msg: "Message created successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          msg: "Message creation failed for unknown reassons",
        });
      }
    }
  }),
];

exports.put_message = asyncHandler(async (req, res, next) => {
  body("content", "content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      msg: "Message information provided was invalid",
    });
  } else {
    const messageToUpdate = await prisma.message.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        content: req.body.content,
      },
    });
    if (messageToUpdate) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Unknown error updating message",
      });
    }
  }
});

exports.delete_message = asyncHandler(async (req, res, next) => {
  const messageToDelete = await prisma.message.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });
  if (messageToDelete) {
    constDeleteLikes = await prisma.likemessage.deleteMany({
      where: {
        messageId: Number(messageToDelete.id),
      },
    });

    const deleteMessage = await prisma.message.delete({
      where: {
        id: Number(messageToDelete.id),
      },
    });
    if (deleteMessage) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Unknown error deleting message",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      msg: "Message to be deleted could not be found",
    });
  }
});

exports.get_messagelikes = asyncHandler(async (req, res, next) => {
  console.log("getting likes", Number(req.params.id));
  const likes = await prisma.likemessage.findMany({
    where: {
      messageId: Number(req.params.id),
    },
    select: {
      id: true,
      likerId: true,
      liker: true,
      messageId: true,
    },
  });
  console.log(likes);
  if (likes) {
    console.log("returning likes");
    res.send({
      success: true,
      likes: likes,
    });
    res.status(200).json({
      success: true,
      likes: likes,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting likes",
    });
  }
});

exports.post_likemessage = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const newLike = await prisma.likemessage.create({
    data: {
      likerId: req.body.likerId,
      messageId: req.body.messageId,
    },
  });
  console.log("liked");
  if (newLike) {
    res.status(200).json({
      success: true,
      msg: "Message liked successfully",
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Like failed for unknown reassons",
    });
  }
});

exports.delete_likemessage = asyncHandler(async (req, res, next) => {
  const likeToDelete = await prisma.likemessage.findFirst({
    where: {
      likerId: req.body.likerId,
      messageId: req.body.messageId,
    },
  });
  console.log(likeToDelete);
  if (likeToDelete) {
    const deleteLike = await prisma.likemessage.delete({
      where: {
        id: Number(likeToDelete.id),
      },
    });

    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error deleting like",
    });
  }
});
