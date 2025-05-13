import { getCustomSession } from "@/app/api/sessions/sessionCode";

export async function GET(req, res) {
    console.log("In the API login page");

    //We need the have the values sent to us
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const pass = searchParams.get('pass');
    const accType = searchParams.get('accType');

    console.log(`Email: ${email}, Password: ${pass}, Account Type: ${accType}`);

    //Database gets called here after the variable retrieval
    // =================================================
    const { MongoClient } = require('mongodb');
    const url = 'mongodb+srv://root:t2Csv2wtnama@cluster0.oeiff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(url);
    const dbName = 'app'; // Database name
    console.log('Connecting to the database');

    try {
        //Destroy any previous session that might be present
        const existingSession = await getCustomSession(req);
        if (existingSession) {
            await existingSession.destroy();
        }

        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);

        //Determine which collection to use based on account type
        const determineCollection = accType === 'Manager' ? 'manager' : 'customer';
        const collection = db.collection(determineCollection);

        //Checking if the user exists in the database
        const user = await collection.findOne({ username: email });

        if (!user) {
            //If no user is found, return an error message
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        //Checking if the password matches
        if (user.pass !== pass) {
            //If the password doesn't match, return a failure message
            return new Response(
                JSON.stringify({ success: false, message: "Incorrect password" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        //SESSION CREATION
        const session = await getCustomSession();
        //Storing information about the session
        session.user = {
            id: user._id,
            email,
            accType};
        //Saving the session
        await session.save();

        console.log("Session after login:", session);

        //If the user is authenticated, return a success message
        return new Response(
            JSON.stringify({ success: true, message: "Login successful" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        return new Response(
            JSON.stringify({ success: false, message: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    } finally {
        await client.close();
    }
}
