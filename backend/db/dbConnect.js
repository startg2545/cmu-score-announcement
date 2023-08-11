const { MongoClient } = require("mongodb");

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

const db = async () => {
  const client = new MongoClient(process.env.DB_URL);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    await listDatabases(client);
  } catch (err) {
    console.error(e);
  } finally {
    await client.close();
  }
};

module.exports = db;
