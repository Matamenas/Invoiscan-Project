// In api/deleteDocument.js

import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const url = 'mongodb+srv://root:t2Csv2wtnama@cluster0.oeiff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
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
