import { MongoClient, ObjectId } from "mongodb";

const url = 'mongodb+srv://root:t2Csv2wtnama@cluster0.oeiff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export async function GET() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db("app");

        const customerCollection = await db.collection("customer").find().toArray();
        const managerCollection = await db.collection("manager").find().toArray();

        const users = [...customerCollection, ...managerCollection];

        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Error" }), { status: 500 });
    } finally {
        await client.close();
    }
}

export async function DELETE(req) {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db("app");

        const { userId } = await req.json();

        if (!userId) {
            return new Response(JSON.stringify({ message: "Missing user ID" }), { status: 400 });
        }

        // Try deleting from customer collection first
        let result = await db.collection("customer").deleteOne({ _id: new ObjectId(userId) });

        // If not found in customer, try deleting from manager
        if (result.deletedCount === 0) {
            result = await db.collection("manager").deleteOne({ _id: new ObjectId(userId) });
        }

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(JSON.stringify({ message: "Error deleting user", error: error.message }), { status: 500 });
    } finally {
        await client.close();
    }
}

export async function PATCH(req) {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db("app");

        const { userId, updates } = await req.json();

        console.log("PATCH request body:", { userId, updates });

        if (!userId || !updates) {
            return new Response(JSON.stringify({ message: "Missing user ID or updates" }), { status: 400 });
        }

        // Try updating customer first
        let result = await db.collection("customer").updateOne({ _id: new ObjectId(userId) }, { $set: updates });

        console.log("Customer update result:", result);

        // If not found in customer, try updating in manager
        if (result.modifiedCount === 0) {
            result = await db.collection("manager").updateOne({ _id: new ObjectId(userId) }, { $set: updates });
            console.log("Manager update result:", result);
        }

        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ message: "User not found or no changes made" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ message: "Error updating user", error: error.message }), { status: 500 });
    } finally {
        await client.close();
    }
}
