const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.list_comments = asyncHandler(async (req, res, next) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId: Number(req.params.id),
    },
    select: {
      id: true,
      dateCreated: true,
      content: true,
      ownerId: true,
      owner: true,
      postId: true,
      likes: true,
    },
    orderBy: [
      {
        dateCreated: "asc",
      },
    ],
  });
  if (comments) {
    res.status(200).json({
      success: true,
      comments: comments,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting comments",
    });
  }
});

exports.post_comment = [
  body("content", "content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        msg: "Comment provided was invalid",
      });
    } else {
      const newComment = await prisma.comment.create({
        data: {
          content: req.body.content,
          postId: req.body.postId,
          ownerId: req.body.ownerId,
        },
      });
      if (newComment) {
        res.status(200).json({
          success: true,
          msg: "Comment created successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          msg: "Comment creation failed for unknown reassons",
        });
      }
    }
  }),
];

exports.put_comment = asyncHandler(async (req, res, next) => {
  body("content", "content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      msg: "Comment information provided was invalid",
    });
  } else {
    const commentToUpdate = await prisma.comment.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        content: req.body.content,
      },
    });
    if (commentToUpdate) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Unknown error updating comment",
      });
    }
  }
});

exports.delete_comment = asyncHandler(async (req, res, next) => {
  const commentToDelete = await prisma.comment.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });

  if (commentToDelete) {
    constDeleteLikes = await prisma.likecomment.deleteMany({
      where: {
        commentId: Number(commentToDelete.id),
      },
    });

    const deleteComment = await prisma.comment.delete({
      where: {
        id: Number(commentToDelete.id),
      },
    });
    console.log("dsf");
    if (deleteComment) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Unknown error deleting comment",
      });
    }
  }
});

exports.get_commentlikes = asyncHandler(async (req, res, next) => {
  const likes = await prisma.likecomment.findMany({
    where: {
      commentId: Number(req.params.id),
    },
    select: {
      id: true,
      likerId: true,
      liker: true,
      commentId: true,
    },
  });
  if (likes) {
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

exports.post_likecomment = asyncHandler(async (req, res, next) => {
  const likeExists = await prisma.likecomment.findFirst({
    where: {
      likerId: req.body.likerId,
      commentId: req.body.commentId,
    },
  });
  console.log("liker", req.body.likerId, "comment", req.body.commentId);
  if (!likeExists) {
    const newLike = await prisma.likecomment.create({
      data: {
        likerId: req.body.likerId,
        commentId: req.body.commentId,
      },
    });
    if (newLike) {
      res.status(200).json({
        success: true,
        msg: "Comment liked successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Like failed for unknown reassons",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      msg: "Already liked comment",
    });
  }
});

exports.delete_likecomment = asyncHandler(async (req, res, next) => {
  const likeToDelete = await prisma.likecomment.findFirst({
    where: {
      likerId: req.body.likerId,
      commentId: req.body.commentId,
    },
  });
  if (likeToDelete) {
    const deleteLike = await prisma.likecomment.delete({
      where: {
        id: Number(likeToDelete.id),
      },
    });
    if (deleteLike) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Unknown error deleting like",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error deleting like",
    });
  }
});
