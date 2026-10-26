const { MongoClient } = require('mongodb');
require('dotenv').config();

// MARK: MongoDB configuration
const uri = process.env.MONGODB_URI;
const databaseName = 'PeriodicDB';

let client;
let database;

// MARK: Connect to MongoDB
async function connectDB() {
    if (!uri) {
        throw new Error('MONGODB_URI is missing from .env');
    }

    client = new MongoClient(uri);

    await client.connect();

    database = client.db(databaseName);

    // Verify that MongoDB responds
    await database.command({ ping: 1 });

    console.log(`Connected to MongoDB: ${databaseName}`);
}

// MARK: Access the database
function getDB() {
    if (!database) {
        throw new Error('MongoDB is not connected');
    }

    return database;
}

module.exports = { connectDB, getDB };
