const { ObjectID } = require('mongodb');
const { authorized } = require('../middleware/auth');
const Response = require('../api/response');

module.exports = (router, prefix) => {
    router.post(`${prefix}group/create`, authorized(), async ctx => {
        ctx.validate({
            name: 'string',
            description: 'string'
        });
        const createdGroup = await ctx.store.groups.createGroup(ctx.request.body, ObjectID(ctx.currentUser._id));
        await ctx.store.users.addGroup(ctx.currentUser.login, ObjectID(createdGroup._id));

        new Response(ctx).success({created_group: createdGroup}).write();
    });

    router.get(`${prefix}group/list`, authorized(), async ctx => {
        const { groups_ids } = await ctx.store.users.getGroupsIds(ctx.currentUser.login);

        if (groups_ids.length === 0) {
            new Response(ctx).success({ groups: [] }).write();
            return;
        }

        const groups = await ctx.store.groups.getGroups(groups_ids);

        for (let i = 0; i < groups.length; ++i) {
            const users_ids = groups[i].users_ids;
            if (users_ids.length !== 0) {
                const users = await ctx.store.users.getUsers(users_ids);
                groups[i].users = users;
            } else {
                groups[i].users = [];
            }
        }

        for (let i = 0; i < groups.length; ++i) {
            const checks_ids = groups[i].checks_ids;
            if (checks_ids.length !== 0) {
                const checks = await ctx.store.checks.getChecks(checks_ids);
                groups[i].checks = checks;
            } else {
                groups[i].checks = [];
            }
        }

        new Response(ctx).success({ groups }).write();
    });

    router.post(`${prefix}group/add_user`, authorized(), async ctx => {
        ctx.validate({
            group_id: 'string',
            user_id: 'string'
        });
        await ctx.store.groups.addUsersId(ctx.request.body);

        new Response(ctx).success().write();
    });

    router.post(`${prefix}group/add_check`, authorized(), async ctx => {
        ctx.validate({
            group_id: 'string',
            name: 'string',
            image: 'string'
        });

        const check = await ctx.store.checks.createCheck(ObjectID(ctx.currentUser._id), ctx.request.body);

        await ctx.store.groups.addCheckId(ObjectID(ctx.request.body.group_id), check._id);

        new Response(ctx).success({ check }).write();
    })
};