import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request) {
  console.log("In the AccountantDataRetrieval API route");

  try {
    const dbusername = encodeURIComponent("matasbagdonas02_db_user");
    const dbpassword = encodeURIComponent("PbOLRWD2Hp7LWKwn");
    const url = `mongodb+srv://${dbusername}:${dbpassword}@invoiscan.nrin0wd.mongodb.net/?appName=Invoiscan`
    const client = new MongoClient(url);
    await client.connect();

    const urlObj = new URL(request.url);
    const username = urlObj.searchParams.get('username');
    console.log("The current user is:", username);

    if (!username) {
      return NextResponse.json({ error: 'username query parameter is required' }, { status: 400 });
    }

    console.log("Connected successfully to MongoDB");

    const db = client.db('app');
    const collection = db.collection('Documents');
    const findResult = await collection.find({ username }).toArray();

    console.log("Found documents: ", findResult);

    return NextResponse.json(findResult);
  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}