import {MongoClient} from "../..";

export default async function CheckerMongoDatabaseConnectionService(url: string, user: string | any, password: string | any, dbName: string | any) {
    const client: MongoClient = new MongoClient(
        url,
        {
            auth: {
                username: user,
                password: password
            }
        }
    );
    await client.connect();
}