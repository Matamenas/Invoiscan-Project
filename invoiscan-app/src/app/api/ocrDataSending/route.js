import { NextResponse } from "next/server";
import { getCustomSession } from "@/app/api/sessions/sessionCode";
import { MongoClient } from "mongodb";

export async function POST(request) {
  const session = await getCustomSession();
  
  // We are on the send scanner data to the database page
  console.log("In the ocrDataSending API route");

  // Get the values from request body
  const { storeName, vatReg, date, vat, total, category, receiptImage, username } = await request.json();

  console.log(storeName);
  console.log(vatReg);
  console.log(date);
  console.log(vat);
  console.log(total);

  // <-------------------------------------->
  //             Database call

  const url = 'mongodb+srv://root:t2Csv2wtnama@cluster0.oeiff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(url);
  const dbName = 'app'; // DB NAME

  try {
    await client.connect();
    console.log("Connected successfully to server");
    
    const db = client.db(dbName);
    const collection = db.collection('Documents'); // Collection name

    const myobj = {
      username: session.user.email,
      storeName,
      vatReg,
      date,
      vat,
      total,
      category,
      receiptImage
    };

    await collection.insertOne(myobj);

    // Send success response
    return NextResponse.json({ message: "Success", storeName, vatReg, date, vat, total, username });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
