const passport = require('koa-passport');
const Response = require('../api/response');
const auth = require('../middleware/auth');

module.exports = router => {
    router.post('/register', async (ctx, next) => {
        console.log('ctx.body', ctx.request.body);

        ctx.validate({
            login: 'string',
            password: 'string',
        });

        await passport.authenticate('custom-strategy', async function (error, user) {
            if (error || !user) {
                return new Response(ctx).error(400, { message: 'Something wrong' }).write();
            }

            const loggedUser = await ctx.store.users.login(user);

            const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
            const token = auth.createToken({ ...loggedUser, exp }, ctx);

            new Response(ctx).success({
                token
            }).write();
        })(ctx, next);
    });
};
