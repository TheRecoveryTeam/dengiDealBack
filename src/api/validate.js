const parameter = require('koa-parameter');
const Response = require('./response');

module.exports = app => {
    parameter(app);

    app.context.validate = function(rules) {
        try {
            this.verifyParams(rules);
        } catch (err) {
            new Response(this).error(400, { errors: err.errors }).write();
        }
    };
};