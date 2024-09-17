const { useQueue } = require('discord-player');

/**
 * Checks if the user is in a voice channel.
 * @param {Interaction} interaction - The Discord interaction.
 * @returns {boolean} - True if the user is in a voice channel, false otherwise.
 */
function isUserInVoiceChannel(interaction) {
  if(!interaction.member.voice.channel){
    return false
  };
  return true;
}

/**
 * Checks if there's an active music queue in the guild.
 * @param {Interaction} interaction - The Discord interaction.
 * @returns {boolean} - True if there's an active queue, false otherwise.
 */
function hasActiveQueue(interaction) {
  const queue = useQueue(interaction.guild.id);
  if (!queue) {
    return false;
  }
  return true;
}

/**
 * Sends an error message if the user is not in a voice channel.
 * @param {Interaction} interaction - The Discord interaction.
 * @returns {Promise<boolean>} - Returns true if an error message was sent, false otherwise.
 */
async function ensureUserInVoiceChannel(interaction) {
  if (!isUserInVoiceChannel(interaction)) {
    await interaction.reply({ 
      content: 'You need to be in a voice channel to use this command.', 
      ephemeral: true 
    });
    return false;
  }
  return true;
}

/**
 * Sends an error message if there's no active music queue.
 * @param {Interaction} interaction - The Discord interaction.
 * @returns {Promise<boolean>} - Returns true if an error message was sent, false otherwise.
 */
async function ensureActiveQueue(interaction) {
  if (!hasActiveQueue(interaction)) {
    await interaction.reply({ 
      content: 'There is no music currently playing.', 
      ephemeral: true 
    });
    return false;
  }
  return true;
}

/**
 * Sends an error message if there's no active music queue.
 * @param {Interaction} interaction - The Discord interaction.
 * @returns {Promise<boolean>} - Returns true if an error message was sent, false otherwise.
 */
async function ensureActiveQueueAndChannel(interaction) {
  if (ensureUserInVoiceChannel(interaction)) {
    if (ensureActiveQueue(interaction)) {
      return true
    }
  }
  return false;
}

module.exports = {
  isUserInVoiceChannel,
  hasActiveQueue,
  ensureUserInVoiceChannel,
  ensureActiveQueue,
  ensureActiveQueueAndChannel,
};