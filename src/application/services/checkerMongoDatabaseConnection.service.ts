import {MongoClient} from "../..";

/**
 *
 * @param url
 * @param user
 * @param password
 * @param dbName
 * @constructor
 */
export default async function CheckerMongoDatabaseConnectionService(url: string, user: string | any,
                                                                    password: string | any,
                                                                    dbName: string | any): Promise<void> {
    const client: MongoClient = new MongoClient(
        url,
        {
            auth: { username: user, password: password }
        }
    );
    await client.connect();
}