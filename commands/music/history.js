const { useHistory } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('View queue history'),
  async execute(interaction) {
    const history = useHistory(interaction.guild.id);

    if (!history || history.isEmpty()) {
      return interaction.reply({
        content: 'No history to view. Play something first cool cat and make sure loop mode is off!',
        ephemeral: true,
      });
    }

    const tracks = history.tracks.toArray();

    // Prepare the response for the history
    let response = ``;

    // If there are tracks in the history, display them
    if (tracks.length > 0) {
      response += '**You\'ve been listening to: **\n';
      const trackList = tracks.slice(0, 40) // Limit to last 40 tracks
        .map((track, index) => `${index + 1}. **${track.title}** by ${track.author}`)
        .join('\n');

      response += trackList;
    } else {
      response += 'There are no more tracks in the history.';
    }

    await interaction.reply(response);
  }
}