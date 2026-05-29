// In api/deleteDocument.js

import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const dbusername = encodeURIComponent("matasbagdonas02_db_user");
    const dbpassword = encodeURIComponent("PbOLRWD2Hp7LWKwn");
    const url = `mongodb+srv://${dbusername}:${dbpassword}@invoiscan.nrin0wd.mongodb.net/?appName=Invoiscan`
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db('app');
    const collection = db.collection('Documents');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: "Document deleted" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
