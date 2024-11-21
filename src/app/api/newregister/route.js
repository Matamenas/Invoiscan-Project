export async function GET(req, res) {
    // Log to confirm reaching the API
    console.log("in the api page");

    // Extract parameters from the request URL
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const pass = searchParams.get('pass');
    const address = searchParams.get('address');
    const validemail = searchParams.get('validemail');
    const telephone = searchParams.get('telephone');
    const validpass = searchParams.get('validpass');

    // Log the extracted values
    console.log("Email:", email);
    console.log("Password:", pass);
    console.log("Address:", address);
    console.log("Validation Email:", validemail);
    console.log("Telephone:", telephone);
    console.log("Validation Password:", validpass);

    // Database call or additional processing goes here

    // Send a response back
    return Response.json({ "data": "valid" });
}
