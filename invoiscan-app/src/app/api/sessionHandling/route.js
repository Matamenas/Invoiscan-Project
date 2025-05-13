import { getCustomSession } from '../sessions/sessionCode';

//GET method: Used to retrieve the session
export async function GET(req) {
    try {
        //Debugging CONSOLE LINE
        console.log("Fetching session in API...");
        const session = await getCustomSession(req);
        //Debugging CONSOLE LINE
        console.log("Session fetched in API:", session);

        if (session?.user) {
            //Debugging CONSOLE LINE
            console.log("Session is valid, returning user:", session.user);
            return new Response(JSON.stringify(session.user), { status: 200 });
        }

        //Debugging CONSOLE LINE
        console.log("No session found");
        return new Response(JSON.stringify({ message: "No active session" }), { status: 401 });
    }
    catch (error) {
        console.error("Error retrieving session:", error);
        return new Response(JSON.stringify({ error: "Error retrieving session" }), { status: 500 });
    }
}

//DELETE method: Destroys the session
export async function DELETE(req) {
    try {
        const session = await getCustomSession(req);
        if (session) {
            await session.destroy();
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Error destroying session:", error);
        return new Response(JSON.stringify({ error: "Error destroying session" }), { status: 500 });
    }
}
