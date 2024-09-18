const SpotifyWebApi = require('spotify-web-api-node');

class SpotifyClient {
  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    this.tokenExpiration = null;
  }

  async getAccessToken() {
    const currentTime = new Date().getTime();
    if (this.tokenExpiration && currentTime < this.tokenExpiration) {
      return this.spotifyApi.getAccessToken();
    }

    try {
      const data = await this.spotifyApi.clientCredentialsGrant();
      this.spotifyApi.setAccessToken(data.body['access_token']);
      this.tokenExpiration = currentTime + data.body['expires_in'] * 1000; // Set expiration time
      return data.body['access_token'];
    } catch (err) {
      console.error('Error retrieving Spotify access token', err);
      throw new Error('Error connecting to Spotify.');
    }
  }

  getSpotifyApi() {
    return this.spotifyApi;
  }
}

module.exports = new SpotifyClient();
