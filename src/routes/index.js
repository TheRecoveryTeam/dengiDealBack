const user = require('./user');
const Response = require('../api/response');

module.exports = (router) => {
    user(router);

    router.get('/ping', async ctx => {
        new Response(ctx).success({
            hello: 'world'
        }).write();
    });
};
