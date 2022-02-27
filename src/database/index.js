const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Snippet = require('./models/Snippet');

class Database {
    constructor() {
        this.Snippet = Snippet
    }

    async open() {
        const uri = await this.generateDatabaseUri();
        return this.connection = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(data => { console.info('Connected to MongoDB'); return data })
            .catch(error => console.error('Failed to connect: ', error));
    }

    close() {
        return this.connection.disconnect();
    }

    async generateDatabaseUri() {
        if (process.isDevelopment) {
            this.mongod = new MongoMemoryServer();
            return await this.mongod.getUri();
        } else {
            const {
                MONGODB_USERNAME: username,
                MONGODB_PASSWORD: password,
                MONGODB_CLUSTER: cluster,
                MONGODB_DATABASE: database
            } = process.env;
            return `mongodb+srv://${username}:${password}@${cluster}` +
                `.mongodb.net/${database}?retryWrites=true&w=majority`;
        }
    }
}

module.exports = Database;