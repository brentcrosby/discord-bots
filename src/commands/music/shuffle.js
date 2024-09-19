const { useQueue } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const { ensureActiveQueueAndChannel } = require('../../utils/musicUtils');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle tracks in queue.'),
  async execute(interaction) {

    // Ensure the user is in a voice channel and there is an active queue
    const check = await ensureActiveQueueAndChannel(interaction);
    if (!check) return;

    const queue = useQueue(interaction.guild.id);
    queue.tracks.shuffle();

    await interaction.reply('Shuffled the queue for ya boss!');

  } 
}