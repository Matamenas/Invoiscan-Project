import { getCustomSession } from "../sessions/sessionCode";
export async function GET(req, res) {

    let session = await getCustomSession();
    let customersRole = session.role;

    console.log(customersRole);
    let email = session.email;
    console.log(email);

    return Response.json({});
}

