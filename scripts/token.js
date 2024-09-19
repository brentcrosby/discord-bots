const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const authorizationCode = process.env.SPOTIFY_AUTHORIZATION_CODE;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

spotifyApi.authorizationCodeGrant(authorizationCode).then(
  function(data) {
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Expires in:', data.body['expires_in']);

    // Update the .env file
    const envFilePath = path.resolve(__dirname, '../.env');
    let envConfig = fs.readFileSync(envFilePath, 'utf8');

    envConfig = envConfig.replace(/SPOTIFY_ACCESS_TOKEN=.*/g, `SPOTIFY_ACCESS_TOKEN=${accessToken}`);
    envConfig = envConfig.replace(/SPOTIFY_REFRESH_TOKEN=.*/g, `SPOTIFY_REFRESH_TOKEN=${refreshToken}`);

    fs.writeFileSync(envFilePath, envConfig);
    console.log('.env file updated with new tokens.');
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);
