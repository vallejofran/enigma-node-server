const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const googleVerify = async (token = '') => {
    const ticket = await client.verifyIdToken({
        token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const {
        name: username,
        picture: img,
        email
    } = ticket.getPayload();

    return { username, img, email };
}

module.exports = {
    googleVerify
}