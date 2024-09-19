const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const authorizationCode = process.env.SPOTIFY_AUTHORIZATION_CODE;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

spotifyApi.authorizationCodeGrant(authorizationCode).then(
  function(data) {
    console.log('Access Token:', data.body['access_token']);
    console.log('Refresh Token:', data.body['refresh_token']);
    console.log('Expires in:', data.body['expires_in']);

    // You can save these tokens to your .env file or a secure location
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);