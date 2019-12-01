const { authorized } = require('../middleware/auth');

const passport = require('koa-passport');
const Response = require('../api/response');
const auth = require('../middleware/auth');

const ERROR_MESSAGES = require('../config/errors');

module.exports = router => {
    router.post('/api/register', async (ctx, next) => {
        ctx.validate({
            login: 'string',
            password: 'string'
        });

        await passport.authenticate('custom-strategy', async function (error, user) {
            if (error || !user) {
                return new Response(ctx).error(400, { message: ERROR_MESSAGES.INVALID_LOGIN_OR_PASSWORD }).write();
            }

            const registeredUser = await ctx.store.users.register(user);

            if (!registeredUser) {
                return new Response(ctx).error(400, { message: ERROR_MESSAGES.LOGIN_IS_ALREADY_EXIST }).write();
            }

            const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
            const token = auth.createToken({ ...registeredUser, exp }, ctx);

            new Response(ctx).success({
                token
            }).write();
        })(ctx, next);
    });

    router.post('/api/login', async ctx => {
        const loggedUser = await ctx.store.users.login(ctx.request.body);

        if (!loggedUser) {
            return new Response(ctx).error(400, { message: ERROR_MESSAGES.WRONG_LOGIN_OR_PASSWORD }).write();
        }

        const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
        const token = auth.createToken({ ...loggedUser, exp }, ctx);

        new Response(ctx).success({
            token
        }).write();
    });

    router.get('/api/check_auth', authorized(), async ctx => {
        new Response(ctx).success().write();
    })
};
