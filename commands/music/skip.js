const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { ensureActiveQueueAndChannel } = require('../../utils/musicUtils');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips current song'),
  async execute(interaction) {

    // Ensure the user is in a voice channel and there is an active queue
    const check = await ensureActiveQueueAndChannel(interaction);
    if (!check) return;

    const queue = useQueue (interaction.guild.id);
    queue.node.skip();
    return interaction.reply('Skipped song');
  }
};