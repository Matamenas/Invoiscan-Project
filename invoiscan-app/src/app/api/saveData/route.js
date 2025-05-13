import { getCustomSession } from '../sessions/sessionCode'

export async function GET(req, res) {
    let session = await getCustomSession()
    session.role = 'customer'

    session.email = 'mymail@mail.com'
    await session.save()
    console.log("Data saved")

    return Response.json({})

}

