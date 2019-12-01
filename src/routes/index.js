const user = require('./user');
const group = require('./group');
const Response = require('../api/response');


module.exports = (router) => {
    const API_PREFIX = '/api/';
    user(router, API_PREFIX);
    group(router, API_PREFIX);

    router.get('/ping', async ctx => {
        new Response(ctx).success({
            hello: 'world'
        }).write();
    });
};
