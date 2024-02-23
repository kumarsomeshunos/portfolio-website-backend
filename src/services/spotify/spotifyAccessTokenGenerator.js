import axios from "axios";
import qs from "qs";

export async function spotifyAccessTokenGenerator() {
   const data = qs.stringify({
      grant_type: "client_credentials",
      client_id: process.env?.SPOTIFY_CLIENT_ID,
      client_secret: process.env?.SPOTIFY_CLIENT_SECRET,
   });

   const config = {
      method: "post",
      url: process.env?.SPOTIFY_TOKEN_BASE_URL,
      headers: {
         "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
   };

   try {
      const response = await axios(config);
      return response.data.access_token;
   } catch (error) {
      console.log(error);
      return null;
   }
}
