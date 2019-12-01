const { ObjectID } = require('mongodb');

const Store = require('./base');

class ChecksStore extends Store {
    get collection() {
        return this.ctx.db.collection('checks');
    }

    async createCheck(user_id, { name = '', image = '', group_id = '' }) {
        const response = await this.collection.insertOne({ name, image, user_id, group_id });
        return response.ops[0];
    }
}

module.exports = ChecksStore;
