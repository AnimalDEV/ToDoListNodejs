const {MongoClient} = require('mongodb');
const login = 'root';
const pass = 'mongodb';
const mongoUrl = `mongodb://${login}:${pass}@mongodb_container:27017/`;
const client = new MongoClient(mongoUrl);


async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function getDatabasesList(client) {
    try {
        await client.connect();
        await listDatabases(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

class Collections {
    constructor(CollectionName) {
        this.dbClient = this.client.db(CollectionName);
        this.collection = this.dbClient.collection(CollectionName);
    }
}

module.exports = {
    client: client,
    getDatabasesList: getDatabasesList
}