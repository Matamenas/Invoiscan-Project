import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers'

export async function getCustomSession(){
    console.log("loading session stuff")
    let pw = "VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf"
    const session = await getIronSession(cookies(), { password: pw, cookieName: "app" });
    // Log session data to check if it's available
    console.log("Session object:", session);
    return session
}
