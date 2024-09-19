// spotifyClient.js
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

class SpotifyClient {
  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });
    this.spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);
    this.spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);
  }

  async getAccessToken() {
    const currentAccessToken = this.spotifyApi.getAccessToken();
    if (currentAccessToken) {
      return currentAccessToken;
    }

    // No access token available, try to refresh it
    try {
      const data = await this.spotifyApi.refreshAccessToken();
      const newAccessToken = data.body['access_token'];
      this.spotifyApi.setAccessToken(newAccessToken);

      // Update the .env file
      this.updateEnvFile('SPOTIFY_ACCESS_TOKEN', newAccessToken);

      console.log('The access token has been refreshed!');
      return newAccessToken;
    } catch (err) {
      console.error('Could not refresh access token', err);
      throw new Error('Error connecting to Spotify.');
    }
  }

  getSpotifyApi() {
    return this.spotifyApi;
  }

  updateEnvFile(key, value) {
    const envFilePath = path.resolve(__dirname, '../.env');
    let envConfig = fs.readFileSync(envFilePath, 'utf8');

    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (envConfig.match(regex)) {
      envConfig = envConfig.replace(regex, `${key}=${value}`);
    } else {
      envConfig += `\n${key}=${value}`;
    }

    fs.writeFileSync(envFilePath, envConfig);
  }
}

module.exports = new SpotifyClient();
