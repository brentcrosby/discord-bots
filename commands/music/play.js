const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const SpotifyWebApi = require('spotify-web-api-node');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or playlist')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('The name or URL of the song or playlist you want to play.')
        .setRequired(true)
    )
    .addIntegerOption((option) => 
      option
        .setName('playlist-track-amount')
        .setDescription('Number of songs to queue from playlist')
        .setRequired(false)
    )
    .addIntegerOption((option) => 
      option
        .setName('queue-from')
        .setDescription('Starting position in playlist to queue from')
        .setRequired(false)
    ),
  async execute(interaction) {
    const player = useMainPlayer();
    const channel = interaction.member.voice.channel;
    const query = interaction.options.getString('query');

    // Check if the user is in a voice channel
    if (!channel) {
      return interaction.reply('You need to be in a voice channel to play music!');
    }

    // Defer the reply to allow time for processing
    await interaction.deferReply();

    // Initialize Spotify API client
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    // Retrieve an access token
    try {
      const data = await spotifyApi.clientCredentialsGrant();
      spotifyApi.setAccessToken(data.body['access_token']);
    } catch (err) {
      console.log('Error retrieving Spotify access token', err);
      return interaction.editReply('Error connecting to Spotify.');
    }

    // Check if the query is a Spotify playlist URL
    const spotifyPlaylistRegex = /https?:\/\/(?:open\.)?spotify\.com\/playlist\/([a-zA-Z0-9]+)(?:\S+)?/;
    const spotifyMatch = query.match(spotifyPlaylistRegex);

    if (spotifyMatch) {
      // It's a Spotify playlist URL
      const playlistId = spotifyMatch[1];

      try {
        // Fetch the playlist tracks from Spotify
        const playlistData = await spotifyApi.getPlaylistTracks(playlistId, {
          fields: 'items(track(name,artists(name)))',
          limit: 100, // Spotify API limit
        });

        const tracks = playlistData.body.items;

        // Prepare an array to hold the search queries
        let searchQueries = tracks.map((item) => {
          const trackName = item.track.name;
          const artistName = item.track.artists[0].name;
          return `${trackName} ${artistName}`;
        });

        // Slice array based on options
        const trackLimit = interaction.options.getInteger('playlist-track-amount') ?? 50;
        const queryStart = interaction.options.getInteger('queue-from');

        if (queryStart > searchQueries.length) {
          return interaction.editReply(`Query start exceeded the playlist length, keep it under ${searchQueries.length}`);
        }

        if (queryStart > 0) {
          let queryEnd = queryStart + trackLimit;
          if (queryEnd > searchQueries.length) {
            queryEnd = searchQueries.length;  // If the track limit exceeds playlist length end at end of playlist
          }
          searchQueries = searchQueries.slice(queryStart, queryEnd);
        } else {
          let queryEnd = trackLimit;
          if (queryEnd > searchQueries.length) {
            queryEnd = searchQueries.length;
          }
          searchQueries = searchQueries.slice(0, queryEnd);
        }


        // Inform the user that the playlist is being processed
        await interaction.editReply(`Processing Spotify playlist with ${searchQueries.length} tracks...`);

        // Loop through each track and search YouTube
        for (const searchQuery of searchQueries) {
          const result = await player.search(searchQuery, {
            requestedBy: interaction.user,
          });

          if (result.hasTracks()) {
            // Play or add the track to the queue
            await player.play(channel, result, {
              nodeOptions: {
                metadata: interaction,
                connectionOptions: { deaf: true },
                volume: 30,
              },
            });
          } else {
            console.log(`No results found for ${searchQuery}`);
          }
        }

        return interaction.followUp(`Added ${searchQueries.length} tracks from the Spotify playlist to the queue! 🎶`);
      } catch (e) {
        console.error('Error processing Spotify playlist', e);
        return interaction.editReply('An error occurred while processing the Spotify playlist.');
      }
    } else {
      // Not a Spotify playlist, proceed with normal search
      const result = await player.search(query, {
        requestedBy: interaction.user,
      });

      if (!result.hasTracks()) {
        return interaction.editReply(`No results found for \`${query}\`.`);
      }

      try {
        // Play the track
        const { queue, track } = await player.play(channel, result, {
          nodeOptions: {
            metadata: interaction,
            connectionOptions: { deaf: true },
            volume: 30,
            repeatMode: 3,
          },
        });

        return interaction.followUp(`You got it cool cat! **${track.title}** added  at position: [${queue.node.getTrackPosition(track) + 1}]`);
      } catch (e) {
        console.error('Error playing track', e);
        return interaction.followUp(`An error occurred: ${e.message}`);
      }
    }
  },
};