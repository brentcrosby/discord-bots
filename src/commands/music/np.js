const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { ensureActiveQueueAndChannel } = require('../../utils/musicUtils.js')

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('np')
    .setDescription('Now Playing; current song info'),
  async execute(interaction) {
    // Check in channel and queue
    const check = await ensureActiveQueueAndChannel(interaction);
    if (!check) return;
    
    const queue = useQueue(interaction.guild.id);
    const track = queue.currentTrack;

    let response = `You\'re grooving to **${track.title}** by ${track.author}\n`
    response += `Duration: ${track.duration}  |  Loop mode: ${queue.repeatMode}  |  Volume: ${queue.node.volume}\n`
    response += `Link: ${track.url}`

    await interaction.reply(response);
  }
}