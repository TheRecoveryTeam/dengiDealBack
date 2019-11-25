const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const setupDB = require('./services/db');
const setupLogger = require('./services/logger');
const validate = require('./api/validate');
const store = require('./middleware/store');
const errors = require('./middleware/errors');
const auth = require('./middleware/auth');
const routes = require('./routes');

module.exports = async config => {
    const app = new Koa();

    app.context.config = config;
    app.context.db = await setupDB(config);
    app.context.logger = setupLogger(config, 'api');
    validate(app);

    // Авторизация
    auth.init(app, config);

    app.on('error', (err, ctx) => {
        if (ctx.status === 500 || !ctx.status) {
            ctx.logger.error(err.stack);
        }
    });

    // Трекаем ошибки
    app.use(errors);

    // Подключаем стор
    app.use(store);

    app.use(auth.setupCurrentUser);

    app.use(bodyParser());

    // Подключаем роуты
    const router = new Router();
    routes(router);
    app.use(router.routes());

    return app;
};
