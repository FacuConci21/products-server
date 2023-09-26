const passport = require("passport");
const localStrategy = require("passport-local");
const githubStrategy = require("passport-github2");
const usersService = require("../../services/users.service");
const strategies = require("../constants/strategies");
const appConfig = require("./app-config");

const LocalStrategy = localStrategy.Strategy;
const GithubStrategy = githubStrategy.Strategy;

const initializePassport = () => {
  passport.use(
    strategies.register,
    new LocalStrategy(
      { passReqToCallback: true, },
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
    new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
      try {
        const currentUser = await usersService.login(username, password);
        return done(null, currentUser);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    strategies.githubLogin,
    new GithubStrategy(
      {
        clientID: appConfig.auth.github.clientId,
        clientSecret: appConfig.auth.github.clientSecret,
        callbackURL: `http://www.${appConfig.host}:${appConfig.port}/auth/login/github`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          /*
          profile._json.name
          profile._json.login
          profile._json.email
          profile.displayName
          profile.username
          */
          const loginUsername = profile.username;
          const user = await usersService.findOne(loginUsername);

          if (!user) {
            const newUser = await usersService.create(
              profile.username,
              profile._json.email,
              "",
              profile.displayName,
              "",
              "usuario"
            );

            return done(null, newUser);
          }

          return done(null, user);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await usersService.findById(id);
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  });
};

module.exports = initializePassport;
