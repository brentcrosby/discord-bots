const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const scopes = ['playlist-read-private'];

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const authorizeURL = spotifyApi.createAuthorizeURL(scopes);

console.log('Authorize URL:', authorizeURL);

// Allow private playlist searches