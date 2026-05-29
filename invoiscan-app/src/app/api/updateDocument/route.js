import { NextResponse } from "next/server";
import { getCustomSession } from "@/app/api/sessions/sessionCode";
import { MongoClient, ObjectId } from "mongodb";

export async function PUT(request) {
  const session = await getCustomSession();
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;


    if (!_id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    const dbusername = encodeURIComponent("matasbagdonas02_db_user");
    const dbpassword = encodeURIComponent("PbOLRWD2Hp7LWKwn");
    const url = `mongodb+srv://${dbusername}:${dbpassword}@invoiscan.nrin0wd.mongodb.net/?appName=Invoiscan`
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db('app');
    const collection = db.collection('Documents');

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
