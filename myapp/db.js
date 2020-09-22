const { MongoClient } = require('mongodb');
const login = 'root';
const pass = 'mongodb';
const mongoUrl = `mongodb://${login}:${pass}@mongodb_container:27017/`;

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}


async function call(method, additionalParams = false) {
    try {
        const options = { useUnifiedTopology: true };
        const client = await MongoClient.connect(mongoUrl, options);
        if (additionalParams) {
            await method(client, additionalParams);
        } else {
            await method(client);
        }
    } catch (e) {
        console.error(e);
    } finally{
        await client.close();
    }
}

async function getDatabasesList() {
    await call(listDatabases);
}

async function addTasksFunctionToDb(client, task) {
    try {
        const db = await client.db("todo");
        await db.collection('todo', function (err, collection) {
            collection.insertOne(task);
            db.collection('todo').countDocuments(function (err, count) {
                console.log('Total Rows: ' + count);
            });
        });
    } catch (e) {
        console.error(e);
    }
}

function validateSchemaTask(task) {
    const allowedKeys = ['name', 'desc'];
    const taskContainName = task.hasOwnProperty('name');
    const taskContainDesc = task.hasOwnProperty('desc');

    if (!taskContainName || !taskContainDesc) {
        throw new Error('Object doesn\'t have required property');
    }

    for (const value of Object.keys(task)) {
        isAllowedKey = allowedKeys.includes(value);
        if (!isAllowedKey) {
            throw new Error('Object has disallowed keys');
        }
    }

    return true;
}

async function addTasksFunction(task) {
    try {
        const correctlySchema = validateSchemaTask(task);
        await call(addTasksFunctionToDb, task);
    } catch (err) {
        console.error(err.message);
    }
}



async function adTask() {
    await call(addTasksFunction);
}

module.exports = {
    getDatabasesList: getDatabasesList,
    addTasksFunction: addTasksFunction,

}