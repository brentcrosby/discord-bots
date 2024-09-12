const { SlashCommandBuilder } = require('discord.js');
const { execute } = require('./reload');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('replies with pong'),
  async execute(interaction) {
    await interaction.reply('pong');
  },
}