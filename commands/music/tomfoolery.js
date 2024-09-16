const { SlashCommandBuilder } = require('discord.js');
const { useQueue, useMainPlayer } = require('discord-player');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('tomfoolery')
    .setDescription('Ooh secret command'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    const player = useMainPlayer();
    const query = 'summer of tomfoolery';

    if(queue.isEmpty() && !queue.isPlaying()) {
      return interaction.reply('Not yet! play a song first');
    }

    // Defer interaction so the request has time to process
    await interaction.deferReply();

    // Search for song
    const result = await player.search(query, {
      requestedBy: interaction.user,
    });

    try {
      queue.insertTrack(result.tracks[0], 0);
      queue.node.skip();
      if (!queue.isPlaying()) {
        await queue.node.play(null, options.audioPlayerOptions);
      }

      await interaction.editReply(`It appears there's a bit of tomfoolery afoot!`)
    } catch (e) {
      // Return error if something failed
      return interaction.followUp(`Something went wrong: ${e}`);
    }

  }
};