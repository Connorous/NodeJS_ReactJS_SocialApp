const passport = require("passport");

var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const appPassport = new passport.Passport();

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

const jwtStrategy = new JwtStrategy(opts, async function (jwt_payload, done) {
  console.log("JWT payload", jwt_payload);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(jwt_payload.sub),
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    if (!user) {
      return done(null, false, { message: "Invalid token" });
    } else {
      return done(null, user);
    }
  } catch (err) {
    return done(err, false);
  }
});

appPassport.use("jwt", jwtStrategy);

module.exports = appPassport;
