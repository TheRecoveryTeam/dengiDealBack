const { authorized } = require('../middleware/auth');

const passport = require('koa-passport');
const Response = require('../api/response');
const auth = require('../middleware/auth');

const ERROR_MESSAGES = require('../config/errors');

module.exports = (router, prefix) => {
    router.post(`${prefix}register`, async (ctx, next) => {

        ctx.validate({
            login: 'string',
            password: 'string',
            first_name: 'string',
            last_name: 'string'
        });

        await passport.authenticate('custom-strategy', async function (error, user) {
            if (error || !user) {
                return new Response(ctx).success({ message: ERROR_MESSAGES.INVALID_LOGIN_OR_PASSWORD }, 'error').write();
            }

            const registeredUser = await ctx.store.users.register(user);

            if (!registeredUser) {
                return new Response(ctx).success({ message: ERROR_MESSAGES.LOGIN_ALREADY_EXISTS }, 'error').write();
            }

            const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
            const token = auth.createToken({ ...registeredUser, exp }, ctx);

            const { password, ...regUser } = registeredUser;

            new Response(ctx).success({
                token,
                user: regUser
            }).write();
        })(ctx, next);
    });

    router.post(`${prefix}login`, async ctx => {

        ctx.validate({
            login: 'string',
            password: 'string'
        });

        const loggedUser = await ctx.store.users.login(ctx.request.body);

        if (!loggedUser) {
            return new Response(ctx).success({ message: ERROR_MESSAGES.WRONG_LOGIN_OR_PASSWORD }, 'error').write();
        }

        const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
        const token = auth.createToken({ ...loggedUser, exp }, ctx);

        const { password, ...user } = loggedUser;

        new Response(ctx).success({
            token,
            user
        }).write();
    });

    router.get(`${prefix}check_auth`, authorized(), async ctx => {
        const { password, ...user } = ctx.currentUser;
        new Response(ctx).success({
            user
        }).write();
    });

};
