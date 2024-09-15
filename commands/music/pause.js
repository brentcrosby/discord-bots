const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the song'),
  async execute(interaction) {
    const queue = useQueue (interaction.guild.id);
    queue.node.setPaused(!queue.node.isPaused());
    return interaction.reply('Paused queue');
  }
};