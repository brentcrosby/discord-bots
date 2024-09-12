const { serialize, deserialize, useMainPlayer } = require('discord-player');

class RedisQueryCache {
  constructor(redis) {
    this.redis = redis;
    this.EXPIRY_TIMEOUT = 3600 * 5; // Cache expiry time in seconds (5 hours)
  }

  // Helper method to create a Redis key for caching
  createKey(id) {
    return `discord-player:query-cache:${id}`;
  }

  // Add a search result (playlist or track) to the cache
  async addData(data) {
    const key = this.createKey(data.query);

    // If the result is a playlist, serialize the playlist; otherwise, serialize individual tracks
    const serialized = JSON.stringify(
      data.playlist
        ? serialize(data.playlist)
        : data.tracks.map((track) => serialize(track))
    );

    // Save the serialized data to Redis with an expiry time
    await this.redis.setex(key, this.EXPIRY_TIMEOUT, serialized);
  }

  // Retrieve cached data for a query from Redis
  async getData() {
    const player = useMainPlayer();

    // Get all cached keys related to the player
    const keys = await this.redis.keys(this.createKey('*'));

    // Retrieve the serialized data for all keys
    const serializedData = await this.redis.mget(keys);

    // Filter out any empty or missing data, then deserialize it
    const deserializedTracks = serializedData
      .filter(Boolean) // Remove null or undefined values
      .map((item) => deserialize(player, JSON.parse(item)));

    // Return the deserialized tracks
    return deserializedTracks.map(
      (track) => ({ track, score: 0 }) // Adding a score field (for internal logic, simplified here)
    );
  }

  // Check if a specific query is already cached in Redis
  async resolve(context) {
    const player = useMainPlayer();

    try {
      const key = this.createKey(context.query);

      // Get the serialized data for the query
      const serialized = await this.redis.get(key);
      if (!serialized) throw new Error('No data found');

      // Deserialize the cached data (could be a track or a playlist)
      const raw = JSON.parse(serialized);
      const parsed = Array.isArray(raw)
        ? raw.map((item) => deserialize(player, item))
        : deserialize(player, raw);

      // Return the search result from the cache
      return {
        query: context.query,
        extractor: Array.isArray(parsed) ? parsed[0].extractor : parsed.tracks[0].extractor,
        tracks: Array.isArray(parsed) ? parsed : parsed.tracks,
        requestedBy: context.requestedBy,
        playlist: Array.isArray(parsed) ? null : parsed,
      };
    } catch {
      // Return an empty result if no cache is found
      return {
        query: context.query,
        extractor: null,
        tracks: [],
        requestedBy: context.requestedBy,
        playlist: null,
      };
    }
  }
}

module.exports = RedisQueryCache;
