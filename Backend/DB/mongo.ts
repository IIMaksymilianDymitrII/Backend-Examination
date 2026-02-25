import {MongoClient} from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI is not defined in .env")

const client = new MongoClient(MONGO_URI);

export async function connectMongo() {
    try{
        await client.connect()
        console.log("Connect to MongoDB!")
        return client.db("gym_db")
    }
    catch(err){
        console.error("Mongo Failed to Connect", err)
        throw err
    }
}
