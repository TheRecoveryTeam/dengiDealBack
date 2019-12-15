const { ObjectId } = require('mongodb');
const passport = require('koa-passport'); //реализация passport для Koa
const LocalStrategy = require('passport-local'); //локальная стратегия авторизации
const passportCustom = require('passport-custom');
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT
const jwt = require('jsonwebtoken');
const Response = require('../api/response');
const CustomStrategy = passportCustom.Strategy;
const ERROR_MESSAGES = require('../config/errors');

const init = (app, config) => {
    passport.use('custom-strategy', new CustomStrategy(async (req, done) => {
        const { login, password, first_name, last_name } = req.body;
          if (login.length !== 0 && password.length !== 0) {
              done(null, {
                  login,
                  password,
                  first_name,
                  last_name
              });
          } else {
              done (null, false)
          }
    }
    ));

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret,
        passReqToCallback: true
    }, async function ({ ctx }, payload, done) {
        try {
            const user = await ctx.store.users.get(payload.login);

            return done(null, user);
        } catch (e) {
            return done(null, false);
        }
    }));

    passport.serializeUser((payload, done) => {
        done(null, {
            _id: payload._id
        });
    });

    passport.deserializeUser(function(user, done) {
        return done(null, user);
    });

    app.use(passport.initialize());
    app.use(passport.session());
};

const createToken = (data, ctx) => jwt.sign(data, ctx.config.jwtSecret);

const setupCurrentUser = async (ctx, next) => {
    await passport.authenticate('jwt', async function (error, user) {
        if (user) {
            ctx.currentUser = { ...user };
            // Обновляем токен
            ctx.set('x-auth-token', createToken(user, ctx));
        }

        await next();
    })(ctx, next);
};

const authorized = () => async (ctx, next) => {
    if (!ctx.currentUser) {
        new Response(ctx).error(401, {message: ERROR_MESSAGES.UNAUTHORIZED}).write();
    } else {
        await next();
    }
};

module.exports = {
    init,
    createToken,
    setupCurrentUser,
    authorized
};
