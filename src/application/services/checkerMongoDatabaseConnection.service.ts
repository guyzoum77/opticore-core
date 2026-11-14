import {MongoClient} from "../..";

/**
 *
 * @param url
 * @param user
 * @param password
 * @param dbName
 * @constructor
 *
 * Connects, pings the database and always closes the client.
 */
export default async function CheckerMongoDatabaseConnectionService(url: string, user: string | any, password: string | any,
                                                                    dbName: string | any): Promise<void> {
    const client: MongoClient = new MongoClient(url, { auth: { username: user, password: password } });
    try {
        await client.connect();
        // A ping confirms that the server answers authenticated commands on this database.
        await client.db(dbName).command({ ping: 1 });
    } finally {
        // The check must not leave a pool of open sockets behind (it kept the process alive before).
        await client.close().catch((): void => undefined);
    }
}