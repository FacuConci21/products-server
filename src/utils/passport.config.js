const passport = require("passport");
const localStrategy = require("passport-local");
const usersService = require("../services/users.service");
const strategies = require("./strategies");

const LocalStrategy = localStrategy.Strategy;

const initializePassport = () => {
  passport.use(
    strategies.register,
    new LocalStrategy(
      { passReqToCallback: true },
      async (req, username, password, done) => {
        const { email, firstName, lastName, role } = req.body;

        try {
          const newUser = await usersService.create(
            username,
            email,
            password,
            firstName,
            lastName,
            role
          );

          return done(null, newUser.toJSON());
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    strategies.localLogin,
    new LocalStrategy({}, async (username, password, done) => {
      try {
        const currentUser = await usersService.login(username, password);
        return done(null, currentUser);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = (await usersService.find({ _id: id })).pop();
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  });
};

module.exports = initializePassport;
