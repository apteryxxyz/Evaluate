import { connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { container } from 'maclary';

export class Database {
    private server: MongoMemoryServer | undefined;
    private connection: typeof import('mongoose') | undefined;

    /**
     * Connect to the MongoDB database.
     */
    public async connect() {
        const uri = await this.getMongoUri();
        this.connection = await connect(uri, {});
        container.logger.info('Connected to MongoDB');
        return this.connection;
    }

    /**
     * Disconnect from the MongoDB database.
     */
    public async disconnect() {
        return this.connection?.disconnect();
    }

    /**
     * Get the URI for the MongoDB database, in the case of
     * development, it will be a memory server.
     */
    public async getMongoUri() {
        // If we're in development, use a local memory server
        if (process.env.NODE_ENV === 'development') {
            this.server = await MongoMemoryServer.create();
            return this.server.getUri();
        }
        return process.env.DATABASE_URL as string;
    }
}
