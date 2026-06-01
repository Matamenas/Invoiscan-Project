
import {getCustomSession} from "@/app/api/sessions/sessionCode";
import bcrypt from 'bcrypt';

export async function GET(req, res) {
    //Making a note that we are in the Register Handling API page using a console LOG
    console.log("in the api registerHandling page")
    //Getting the values we need sent across to us
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const pass = searchParams.get('pass')
    const accType = searchParams.get('accType')


    console.log(`Email: ${email}, Password: ${pass}, Account Type: ${accType}`);

    // =================================================
    const { MongoClient } = require('mongodb');
    const dbusername = encodeURIComponent("matasbagdonas02_db_user");
    const dbpassword = encodeURIComponent("PbOLRWD2Hp7LWKwn");
    const url = `mongodb+srv://${dbusername}:${dbpassword}@invoiscan.nrin0wd.mongodb.net/?appName=Invoiscan`
    const client = new MongoClient(url);
    const dbName = 'app';
    console.log('Connected successfully to server');

    await client.connect();
    try {
        //Destroying an existing session if it exists in the first place
        const existingSession = await getCustomSession(req);
        if (existingSession) {
            await existingSession.destroy();
        }
        console.log('Connected successfully to server');

        const db = client.db(dbName);

        const determineCollection = accType === 'Manager' ? 'manager' : 'customer';
        const collection = db.collection(determineCollection);

        //If a user already exists in the collection, lets let the user know
        const findUser = await collection.findOne({ username: email });
        if (findUser) {
            alert('A user with that email already exists')
            console.log(`Email ${email} already exists`);

            return new Response(
                JSON.stringify({success: false, message: "Email already registered"}),
                {status: 409, headers: {"Content-Type": "application/json"}}
            );
        }

        //Hash the password before storing
        const hashedPassword = await bcrypt.hash(pass, 10);

        //Inserting the new account
        const result = await collection.insertOne({ username: email, pass: hashedPassword, accType: accType, createdAt: new Date()});
        console.log(`New account created in ${determineCollection} collection:`, result);

        //SESSION CREATION
        const session = await getCustomSession(req);
        session.user = {
            id: result.insertedId,
            email,
            accType};
            await session.save();

        console.log("Session after REGISTRATION:", session);

        //Sending a success response
        return new Response(
            JSON.stringify({ success: true, message: "Account created successfully" }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
    finally {
        await client.close();
    }
}
