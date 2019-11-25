const mongodb = require('mongodb');

module.exports = async config => {
    try {
        let db = await mongodb.MongoClient.connect(config.mongoUri, {
            reconnectTries: 28800,
            reconnectInterval: 1000,
            useNewUrlParser: true
        });
        db = db.db(config.mongoDb);

        await db.collection('users').createIndex("login");

        return db;
    } catch (Error) {
        console.error(`can't connect to mongodb ${config.mongoUri}`);
        throw Error;
    }
};
