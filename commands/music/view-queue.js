const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('view-queue')
    .setDescription('View all the songs in queue'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);


    if (!queue || !queue.currentTrack) {
      return interaction.reply('There is no song currently playing!');
    }
    
    const tracks = queue.tracks.toArray(); //Converts the queue into an array of tracks
    const currentTrack = queue.currentTrack; //Gets the current track being played

    // Prepare the response for the current track
    let response = `🎶 Now Playing: **${currentTrack.title}** by ${currentTrack.author}\n\n`;

    // If there are tracks in the queue, display them
    if (tracks.length > 0) {
      response += '**Up Next:**\n';
      const trackList = tracks.slice(0, 20) // Limit to first 10 tracks
        .map((track, index) => `${index + 1}. **${track.title}** by ${track.author}`)
        .join('\n');

      response += trackList;
    } else {
      response += 'There are no more tracks in the queue.';
    }

    await interaction.reply(response);
  }
};