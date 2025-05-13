import {MongoClient, ObjectId} from "mongodb";

const url = 'mongodb+srv://root:t2Csv2wtnama@cluster0.oeiff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export async function PATCH(req) {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const dbName = "app";
        const db = client.db(dbName);

        const { userId, updates } = await req.json();

        if (!userId || !updates) {
            return new Response(JSON.stringify({ message: "Missing user" }), { status: 400 });
        }

        const result = await db.collection("customer").updateOne({ _id: new ObjectId(userId)},{ $set: updates });
        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ message: "User not found or no changes made" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "User updated successfully"}), { status: 200 })

    } catch(error) {
        console.error("Error updating user: ", error);
        return new Response(JSON.stringify({ message: "Error updating user", error: error.message }), { status: 500 });
    } finally {
        await client.close();
    }
}