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

        return !!user;
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
