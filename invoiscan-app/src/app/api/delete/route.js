import { MongoClient, ObjectId } from "mongodb";

const url = 'mongodb+srv://root:t2Csv2wtnama@cluster0.oeiff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
export async function DELETE(req) {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const dbName = "app";
        const db = client.db(dbName);

        const { userId } = await req.json();

        if (!userId) {
            return new Response(JSON.stringify({ message: "Missing user" }), { status: 400 });
        }

        const result = await db.collection("customer").deleteOne({ _id: new ObjectId(userId)});
        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ message: "User not found or no changes made" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "User deleted successfully"}), { status: 200 })

    } catch(error) {
        console.error("Error deleting user: ", error);
        return new Response(JSON.stringify({ message: "Error deleting user", error: error.message }), { status: 500 });
    } finally {
        await client.close();
    }
}