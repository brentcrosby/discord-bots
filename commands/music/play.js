const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { playerOptions } = require('../../config/playerOptions')
const spotifyClient = require('../../utils/spotifyClient');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or playlist')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('The name of the song or Spotify url of the playlist or album you want to play.')
        .setRequired(true)
    )
    .addIntegerOption((option) => 
      option
        .setName('track-limit')
        .setDescription('Number of songs to queue from playlist or album')
        .setRequired(false)
    )
    .addIntegerOption((option) => 
      option
        .setName('queue-start')
        .setDescription('Starting position in playlist or album to queue from')
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

    // Retrieve an access token
    try {
      await spotifyClient.getAccessToken();
    } catch (err) {
      return interaction.editReply('Error connecting to Spotify.');
    }

    // Use the Spotify API instance
    const spotifyApi = spotifyClient.getSpotifyApi();

    // Check if the query is a Spotify playlist URL
    const spotifyPlaylistRegex = /https?:\/\/(?:open\.)?spotify\.com\/playlist\/([a-zA-Z0-9]+)(?:\S+)?/;
    const spotifyAlbumRegex = /https?:\/\/(?:open\.)?spotify\.com\/album\/([a-zA-Z0-9]+)(?:\S+)?/;
    const spotifyPlaylistMatch = query.match(spotifyPlaylistRegex);
    const spotifyAlbumMatch = query.match(spotifyAlbumRegex);

    // Get query options
    const trackLimit = interaction.options.getInteger('track-limit') ?? 50;
    const queryStart = interaction.options.getInteger('queue-start');

    // debug response
    let debug = '';

    if (spotifyPlaylistMatch) {
      // It's a Spotify playlist URL
      const playlistId = spotifyPlaylistMatch[1];
      debug += `playlist id: ${playlistId}\n`;

      try {
        // Fetch the playlist tracks from Spotify
        const playlistData = await spotifyApi.getPlaylistTracks(playlistId, {
          fields: 'items(track(name,artists(name)))',
          limit: trackLimit ?? 50, // use track limit or 50
          offset: queryStart ?? 0,  // start from queryStart index or beginning of playlist
        });

        const tracks = playlistData.body.items;
        debug += `tracks: ${tracks}\n`;

        // Prepare an array to hold the search queries
        let searchQueries = tracks.map((item) => {
          const trackName = item.track.name;
          const artistName = item.track.artists[0].name;
          return `${trackName} ${artistName}`;
        });


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
                ...playerOptions,
              },
            });
          } else {
            console.log(`No results found for ${searchQuery}`);
          }
        }

        // console.log(debug);
        return interaction.followUp(`Added ${searchQueries.length} tracks from the Spotify playlist to the queue! 🎶`);
      } catch (e) {
        console.error('Error processing Spotify playlist', e);
        return interaction.editReply('An error occurred while processing the Spotify playlist.');
      }
    } else if (spotifyAlbumMatch) {  //Spotify album check
      // It's a Spotify album URL
      const albumId = spotifyAlbumMatch[1];
      debug += `Album id: ${albumId}\n`;

      try {
        // Fetch the album tracks from Spotify
        const albumData = await spotifyApi.getAlbumTracks(albumId, {
          fields: 'items(name,artists(name))',
          limit: trackLimit ?? 30, // use track limit or 50
          offset: queryStart ?? 0,  // start from queryStart index or beginning of playlist
        });

        const tracks = albumData.body.items;  //Need to learn how to parse data
        debug +=  `tracks: ${JSON.stringify(tracks, null, 2)}\n`;

        // console.log(debug);
        // Prepare an array to hold the search queries
        let searchQueries = tracks.map((item) => {
          const trackName = item.name;
          const artistName = item.artists[0].name;
          return `${trackName} ${artistName}`;
        });


        // Inform the user that the album is being processed
        await interaction.editReply(`Processing Spotify album with ${searchQueries.length} tracks...`);

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
                ...playerOptions,
              },
            });
          } else {
            console.log(`No results found for ${searchQuery}`);
          }
        }

        // console.log(debug);
        return interaction.followUp(`Added ${searchQueries.length} tracks from the Spotify album to the queue! 🎶`);
      } catch (e) {
        console.error('Error processing Spotify album', e);
        return interaction.editReply('An error occurred while processing the Spotify album.');
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
            ...playerOptions,
          },
        });

        return interaction.followUp(`You got it cool cat! **${track.title}** added at position: [${queue.node.getTrackPosition(track) + 1}]`);
      } catch (e) {
        console.error('Error playing track', e);
        return interaction.followUp(`An error occurred: ${e.message}`);
      }
    }
  },
};