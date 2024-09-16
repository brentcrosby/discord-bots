const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the volume [1-100]')
    .addIntegerOption (option => 
      option
        .setName('value')
        .setDescription('volume level')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async execute(interaction) {
    const queue = useQueue (interaction.guild.id);
    const level = interaction.options.getInteger('value');
    queue.node.setVolume(level);
    await interaction.reply(`Set volume to **${level}**`);
  }
};