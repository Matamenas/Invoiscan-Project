import { getCustomSession } from "@/app/api/sessions/sessionCode";

export async function DELETE(req) {
    try {
        const session = await getCustomSession(req);
        if (session) {
            //If a session exists, destroy it
            await session.destroy();
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error destroying session" }), { status: 500 });
    }
}
