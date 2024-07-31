import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

async function google_verify(token = "") {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENTE_ID,
  });
  const { name, picture, email } = ticket.getPayload();
  return {
    name,
    img: picture,
    email,
  };
}

export { google_verify };
