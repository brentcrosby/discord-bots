const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { ensureActiveQueueAndChannel } = require('../../src/utils/musicUtils')

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Shuts off the player'),
  async execute(interaction) {
    // Check for active queue and channel
    const check = await ensureActiveQueueAndChannel(interaction);
    if (!check) return;

    // Get current queue
    const queue = useQueue(interaction.guild.id);
    queue.node.stop(true);
    return interaction.reply('Gotta Blast!');
  }
}