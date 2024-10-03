const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const jsonwebtoken = require("jsonwebtoken");

exports.list_users = asyncHandler(async (req, res, next) => {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      profileInfo: true,
      id: true,
    },
  });
  if (users) {
    res.status(200).json({
      success: true,
      users: users,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting users",
    });
  }
});

exports.search_users = asyncHandler(async (req, res, next) => {
  const searchResults = await prisma.user.findMany({
    where: {
      username: { contains: req.body.search },
      NOT: {
        id: Number(req.body.user.id),
      },
    },
    select: {
      id: true,
      username: true,
      profileInfo: true,
    },
  });

  const relationships = await prisma.relationship.findMany({
    where: {
      OR: [
        {
          user1Id: Number(req.body.user.id),
        },
        {
          user2Id: Number(req.body.user.id),
        },
      ],
    },
    select: {
      user1Id: true,
      user2Id: true,
    },
  });
  console.log(relationships);
  var filteredSearchResults = [];
  if (relationships) {
    if (relationships.length > 0) {
      for (var i = 0; i < searchResults.length; i++) {
        var currentSearchResult = searchResults[i];
        var addResult = true;
        for (var j = 0; j < relationships.length; j++) {
          var currentRelation = relationships[j];
          if (
            currentSearchResult.id === currentRelation.user1Id ||
            currentSearchResult.id === currentRelation.user2Id
          ) {
            addResult = false;
            break;
          }
        }

        if (addResult) {
          filteredSearchResults.push(currentSearchResult);
        }
      }
    } else {
      filteredSearchResults = searchResults;
      console.log("no");
    }
  }

  if (!filteredSearchResults) {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting search results",
    });
  } else {
    res.status(200).json({
      success: true,
      searchResults: filteredSearchResults,
    });
  }
});

exports.search_users_guest = asyncHandler(async (req, res, next) => {
  const searchResults = await prisma.user.findMany({
    where: {
      username: { contains: req.body.search },
    },
    select: {
      id: true,
      username: true,
      profileInfo: true,
    },
  });

  if (!searchResults) {
    res.status(400).json({
      success: false,
      msg: "Unknown error getting search results",
    });
  } else {
    res.status(200).json({
      success: true,
      searchResults: searchResults,
    });
  }
});

exports.get_user = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: {
      id: true,
      email: true,
      username: true,
      dateCreated: true,
      profileInfo: true,
    },
  });

  if (!user) {
    res.status(400).json({
      success: false,
      msg: "User with the details provided does not exist",
    });
  } else {
    res.status(200).json({
      success: true,
      user: user,
    });
  }
});

exports.login_user = asyncHandler(async (req, res, next) => {
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();
  body("password", "password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send("401").json({ msg: errors });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      profileInfo: true,
    },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      msg: "User with the details provided does not exist",
    });
    return;
  } else {
    var match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const payload = { sub: user.id, iat: Date.now() };
      const expiresIn = "1d";
      const secretorkey = process.env.SECRET;
      const signedToken = jsonwebtoken.sign(payload, secretorkey, {
        expiresIn: expiresIn,
      });
      const token = "Bearer " + signedToken;

      res.status(200).json({
        success: true,
        token: token,
        expiresIn: expiresIn,
        user: user,
      });
    } else {
      res.status(401).json({
        success: false,
        msg: "Incorrect password",
      });
    }
  }
});

exports.logout_user = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, token: null, expiresIn: null });
});

exports.post_user = [
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmpassword", "confirm password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmpassword", "Both passwords must match").custom(
    (value, { req }) => {
      return value === req.body.password;
    }
  ),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        msg: errors,
      });
    } else {
      const emailExists = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
        select: {
          email: true,
        },
      });
      const usernameExists = await prisma.user.findUnique({
        where: {
          username: req.body.username,
        },
        select: {
          email: true,
        },
      });
      if (emailExists) {
        res.status(400).json({
          success: false,
          msg: "User with the email provided already exists",
        });
      } else if (usernameExists) {
        res.status(400).json({
          success: false,
          msg: "User with the username provided already exists",
        });
      } else {
        try {
          var password = req.body.password;
          bcrypt.hash(password, 10, async (err, hashedPassword) => {
            const newUser = await prisma.user.create({
              data: {
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword,
              },
            });
            if (newUser) {
              res.status(200).json({
                success: true,
                msg: "User created successfully",
              });
            } else {
              res.status(400).json({
                success: true,
                msg: "User creation failed for unknown reassons",
              });
            }
          });
        } catch (err) {
          console.log(err);
          return next(err);
        }
      }
    }
  }),
];

exports.put_user_profile = [
  body("profileInfo", "profileInfo must not be empty.").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        msg: errors,
      });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          id: req.body.userId,
        },
        select: {
          id: true,
        },
      });
      if (user) {
        const userToUpdateProfileInfo = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            profileInfo: req.body.profileInfo,
          },
        });
        if (userToUpdateProfileInfo) {
          const updatedUser = await prisma.user.findUnique({
            where: {
              id: user.id,
            },
            select: {
              id: true,
              username: true,
              profileInfo: true,
            },
          });
          res.status(200).json({
            success: true,
            updatedUser: updatedUser,
          });
        } else {
          res.status(400).json({
            success: false,
            msg: "Unknown error updating user profile info",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          msg: "Unknown error getting user to update profile info",
        });
      }
    }
  }),
];

exports.delete_user = asyncHandler(async (req, res, next) => {
  const userToDelete = await prisma.user.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  if (userToDelete) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "Unknown error deleting user",
    });
  }
});
