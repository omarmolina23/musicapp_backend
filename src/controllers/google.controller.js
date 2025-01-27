import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../config.js";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleDecode = async (req, res) => {
    const { token } = req.body;

    if(!token) return res.status(400).json({message: "No se ha proporcionado un token de Google"});

    try {
        const ticket = await client.verifyIdToken({idToken: token, audience: GOOGLE_CLIENT_ID});
        const payload = ticket.getPayload();

        const {name, email, sub} = payload;

        res.json({name, email, googleId: sub});
    } catch (err) {
        return res.status(400).json({message: "Token de Google no valido"});
    }
};