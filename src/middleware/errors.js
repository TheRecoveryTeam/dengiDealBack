module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.errorData || 'internal server error';
        ctx.app.emit('error', err, ctx);
    }
};