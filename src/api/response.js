class Response {
    constructor(ctx) {
        this.ctx = ctx;
        this.status = '';
        this.data = {};
    }

    error(statusCode, errorData) {
        this.status = 'error';
        this.data = {
            statusCode,
            errorData
        };

        return this;
    }

    success(data = {}, status = 'ok') {
        this.status = status;
        this.data = { ...this.data, ...data };

        return this;
    }

    write() {
        if (!this.data.statusCode) {
            this.ctx.logger.info(`send 200`);
            this.ctx.body = {
                status: this.status,
                data: this.data
            };
        } else {
            const {
                statusCode,
                errorData
            } = this.data;

            this.ctx.logger.info(`send ${statusCode}`);

            this.ctx.throw(statusCode, null, {
                errorData: {
                    status: this.status,
                    data: errorData
                }
            });
        }
    }
}

module.exports = Response;
