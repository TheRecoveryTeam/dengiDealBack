const { ObjectID } = require('mongodb');

const Store = require('./base');

class GroupsStore extends Store {
    get collection() {
        return this.ctx.db.collection('groups');
    }

    async createGroup({ name = '', description = '', users_ids = [], checks_ids = [] }, user_id) {
        const response = await this.collection.insertOne({name, description, users_ids , checks_ids, user_id});
        return response.ops[0];
    }

    async getGroups(groupsIds) {
        return await this.collection.find({ _id: { $in: groupsIds }}).toArray();
    }

    async addUsersId({ group_id, user_id }) {
        await this.collection.updateOne({ _id: ObjectID(group_id) }, { $push: { users_ids: ObjectID(user_id) }});
    }

    async addCheckId(group_id, check_id) {
        await this.collection.updateOne({ _id: ObjectID(group_id) }, { $push: { checks_ids: ObjectID(check_id) }});
    }
}

module.exports = GroupsStore;
