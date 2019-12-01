const Store = require('./base');

class UserStore extends Store {
    get collection() {
        return this.ctx.db.collection('users');
    }

    async register(data) {
        const user = await this.collection.findOne({ login: data.login });
        if (user) {
            return false;
        }

        return await this.addUser(data);
    }

    async login({ login, password }) {
        const user = await this.collection.findOne({ login, password });

        return user ? user : null;
    }

    async get(login) {
        return await this.collection.findOne({ login });
    }

    async addUser(user) {
        const response =  await this.collection.insertOne({
         ...user,
        first_name: '',
        last_name: '',
        avatar: '',
        groups_ids: [],
        checks_ids: []
        });

        return response.ops[0];
    }

    async addGroup(login, groupId) {
        await this.collection.updateOne({ login },
            { $push: { groups_ids: groupId } }
        );
    }

    async getGroupsIds(login) {
        return this.collection.findOne({ login }, {
            projection: { groups_ids: 1, _id: 0 }
        })
    }

    async getUsers(users_ids) {
        return await this.collection
            .find({ _id: { $in: users_ids }})
            .project({ login: 1, avatar: 1, first_name: 1, last_name: 1 })
            .toArray();
    }
}

module.exports = UserStore;
