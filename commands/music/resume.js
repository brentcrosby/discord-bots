const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the queue'),
  async execute(interaction) {
    const queue = useQueue (interaction.guild.id);
    queue.node.resume();
    return interaction.reply('Resumed queue');
  }
};