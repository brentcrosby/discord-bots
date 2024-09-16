const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('clear-queue')
    .setDescription('Clear the current queue'),
  async execute(interaction) {
    const queue = useQueue (interaction.guild.id);
    queue.clear();
    return interaction.reply('Cleared Queue');
  }
};