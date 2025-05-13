import { MongoClient } from "mongodb";

const url = 'mongodb+srv://root:t2Csv2wtnama@cluster0.oeiff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

export async function GET() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const dbName = 'app';
        const db = client.db(dbName);
        const customerCollection = await db.collection("customer").countDocuments();
        console.log("Customer Count:", customerCollection);
        const managerCollection = await db.collection("manager").countDocuments();
        console.log("Manager Count:", managerCollection);
        //Total Users Count
        const totalUsers = managerCollection + customerCollection;
        console.log("Total Users:", totalUsers);

        //Count Users Created in the Last 7 Days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentCustomers = await db.collection("customer").countDocuments({ createdAt: { $gte: oneWeekAgo }});
        console.log("Recent Customer Count:", recentCustomers);
        const recentAdmins = await db.collection("manager").countDocuments({ createdAt: { $gte: oneWeekAgo }})
        console.log("Recent Manager Count:", recentAdmins);
        const totalRecentUsers = recentCustomers + recentAdmins;
        console.log("Total Recent Users:", totalRecentUsers);

        return new Response(JSON.stringify({ totalUsers, totalRecentUsers }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        // Log the error for debugging purposes
        console.error("Error fetching analytics:", error);

        // Return a more detailed error message to the client
        return new Response(JSON.stringify({ message: "Error fetching analytics", error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });    }
    finally {
        await client.close();
    }
}