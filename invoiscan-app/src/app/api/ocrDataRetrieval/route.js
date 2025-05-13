import { NextResponse } from "next/server";
import { getCustomSession } from "@/app/api/sessions/sessionCode";
import { MongoClient } from "mongodb";

export async function GET() {
  console.log("In the getOcrDataRetrieval API route");

  try {
    
    const url = 'mongodb+srv://root:t2Csv2wtnama@cluster0.oeiff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(url);
    await client.connect();

    const session = await getCustomSession();
    const username = session.user.email;
    console.log("The current user is:", username);

    
    console.log("Connected successfully to MongoDB");

    const db = client.db('app');
    const collection = db.collection('Documents');
    const findResult = await collection.find({ username: username }).toArray();

    console.log("Found documents: ", findResult);

    return NextResponse.json(findResult);
  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
