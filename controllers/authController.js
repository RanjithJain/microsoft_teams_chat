import axios from "axios";
import qs from "qs";

const clientId = "xxxx";
const clientSecret = "xxxx";

const tenantId = "xxxx";
const redirectUri = "http://localhost:3000/auth/callback";
const authEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

export const auth = (req, res) => {
  const authorizeUrl =
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${redirectUri}` +
    `&response_mode=query` +
    `&scope=User.Read` +
    `&state=12345`;

  res.redirect(authorizeUrl);
};

export const callback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "No authorization code found" });
  }

  try {
    const tokenResponse = await axios.post(
      authEndpoint,
      qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    global.accessToken = tokenResponse.data.access_token;
    res.json({ accessToken });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error getting access token: ${error.message}` });
  }
};

export const getMe = async (req, res) => {
  if (!accessToken) {
    return res.status(400).json({ error: "No access token found" });
  }

  try {
    const userResponse = await axios.get(
      "https://graph.microsoft.com/v1.0/users",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({ user: userResponse.data });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error getting user info: ${error.message}` });
  }
};

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      qs.stringify({
        client_id: clientId,
        scope: "https://graph.microsoft.com/.default",
        client_secret: clientSecret,
        grant_type: "password",
        username: "xxx",
        password: "xxxx",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to obtain access token", error.message);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    global.accessToken = await getAccessToken();
    console.log(accessToken);
    const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};
