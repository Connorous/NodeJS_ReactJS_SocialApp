const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.list_posts = asyncHandler(async (req, res, next) => {
  const posts = await prisma.post.findMany({
    where: {
      pageOwnerId: Number(req.params.id),
    },
    select: {
      id: true,
      dateCreated: true,
      title: true,
      content: true,
      owner: true,
      ownerId: true,
      pageOwner: true,
      pageOwnerId: true,
      likes: true,
    },
    orderBy: [
      {
        dateCreated: "desc",
      },
    ],
  });
  if (posts) {
    res.status(200).json({
      success: true,
      posts: posts,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting posts",
    });
  }
});

exports.get_post = asyncHandler(async (req, res, next) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: {
      id: true,
      dateCreated: true,
      title: true,
      content: true,
      owner: true,
      ownerId: true,
      comments: true,
      likes: true,
      published: true,
    },
  });
  if (post) {
    res.send({
      success: true,
      post: post,
    });
    res.status(200).json({
      success: true,
      post: post,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting post",
    });
  }
});

exports.post_post = [
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("content", "content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        msg: "Post provided was invalid",
      });
    } else {
      const newPost = await prisma.post.create({
        data: {
          title: req.body.title,
          content: req.body.content,
          ownerId: req.body.ownerId,
          pageOwnerId: req.body.pageOwnerId,
        },
      });
      if (newPost) {
        res.status(200).json({
          success: true,
          msg: "Post created successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          msg: "Post creation failed for unknown reassons",
        });
      }
    }
  }),
];

exports.put_post = asyncHandler(async (req, res, next) => {
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();
  body("content", "content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      msg: "Post information provided was invalid",
    });
  } else {
    const postToUpdate = await prisma.post.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });
    if (postToUpdate) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Unknown error updating post",
      });
    }
  }
});

exports.delete_post = asyncHandler(async (req, res, next) => {
  const postToDelete = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: {
      id: true,
    },
  });
  if (postToDelete) {
    const deleteLikes = await prisma.likepost.deleteMany({
      where: {
        postId: Number(postToDelete.id),
      },
    });

    const postComments = await prisma.comment.findMany({
      where: {
        postId: Number(req.params.id),
      },
    });

    for (var i = 0; i < postComments.length; i++) {
      deleteCommentLikes = await prisma.likecomment.deleteMany({
        where: {
          commentId: postComments[i].id,
        },
      });
    }

    const deleteComments = await prisma.comment.deleteMany({
      where: {
        postId: Number(postToDelete.id),
      },
    });

    const deletePost = await prisma.post.delete({
      where: {
        id: Number(postToDelete.id),
      },
    });
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Post to be deleted could not be found",
    });
  }
});

exports.get_postlikes = asyncHandler(async (req, res, next) => {
  const likes = await prisma.likepost.findMany({
    where: {
      postId: Number(req.params.id),
    },
    select: {
      id: true,
      likerId: true,
      liker: true,
      postId: true,
    },
  });
  if (likes) {
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

exports.post_likepost = asyncHandler(async (req, res, next) => {
  const likeExists = await prisma.likepost.findFirst({
    where: {
      likerId: req.body.likerId,
      postId: req.body.postId,
    },
  });
  if (!likeExists) {
    const newLike = await prisma.likepost.create({
      data: {
        likerId: req.body.likerId,
        postId: req.body.postId,
      },
    });
    if (newLike) {
      res.status(200).json({
        success: true,
        msg: "Post liked successfully",
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
      msg: "Already liked post",
    });
  }
});

exports.delete_likepost = asyncHandler(async (req, res, next) => {
  const likeToDelete = await prisma.likepost.findFirst({
    where: {
      likerId: req.body.likerId,
      postId: req.body.postId,
    },
  });

  if (likeToDelete) {
    const deleteLike = await prisma.likepost.delete({
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
