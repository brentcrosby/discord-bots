const { SlashCommandBuilder } = require('discord.js');
const { ensureActiveQueueAndChannel } = require('../../utils/musicUtils');
const { parseTimeToMs } = require('../../utils/utils');
const { useQueue } = require('discord-player');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Seek to a timestamp in the current track')
    .addStringOption(option =>
			option.setName('timestamp')
				.setDescription('mm:ss')
				.setRequired(true)
				),
  
  async execute(interaction) {

    // Ensure the user is in a voice channel and there is an active queue
    const check = await ensureActiveQueueAndChannel(interaction);
    if (!check) return;

    const timestamp = interaction.options.getString('timestamp');
    const timestampMs = parseTimeToMs(timestamp);
    const queue = useQueue(interaction.guild.id);
    const track = queue.currentTrack;

    if (timestampMs > track.durationMS) {
      return interaction.reply({ content: `Provide a timestamp within 00:00 and ${track.duration}`, ephemeral: true});
    }

    await queue.node.seek(timestampMs);
    return interaction.reply({content: `Continuing playback from ${timestamp}!`});
  }
}

// Crashes the player
