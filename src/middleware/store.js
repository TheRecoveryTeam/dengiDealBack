const stores = require('../store');

module.exports = async (ctx, next) => {
    ctx.store = {};

    for (let storeName of Object.keys(stores)) {
        ctx.store[storeName] = new stores[storeName](ctx);
    }

    await next();
};