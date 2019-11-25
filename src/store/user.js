const Store = require('./base');

class UserStore extends Store {
    get collection() {
        return this.ctx.db.collection('users');
    }

    async login(data) {
        const user = await this.collection.findOne({ login: data.login });
        return !user ? await this.addUser(data) : user;
    }

    async get(login) {
        return await this.collection.findOne({ login });
    }

    async addUser(user) {
        const response =  await this.collection.insertOne({
         ...user,
        });

        return response.ops[0];
    }
}

module.exports = UserStore;
