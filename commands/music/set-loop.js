const { 
  SlashCommandBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ActionRowBuilder 
} = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('set-loop')
    .setDescription('Set the loop-mode')
    .addIntegerOption(option =>
			option.setName('loop-mode')
				.setDescription('Different Loop modes')
				.setRequired(true)
				.addChoices(
					{ name: 'Off', value: 0 },
					{ name: 'Loop track', value: 1 },
					{ name: 'Loop queue', value: 2 },
          { name: 'Autoplay', value: 3 },
				)),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    // Check if the user is in a voice channel
    if (!interaction.member.voice.channel) {
      return interaction.reply({ 
        content: 'You need to be in a voice channel to use this command.', 
        ephemeral: true 
      });
    }

    // Check if there's an active queue
    if (!queue || !queue.node.isPlaying()) {
      return interaction.reply({ 
        content: 'There is no music currently playing.', 
        ephemeral: true 
      });
    }

    // Get option and set loop mode
    const mode = interaction.options.getInteger('loop-mode');
    queue.setRepeatMode(mode);

    // Define labels for feedback
    const modeLabels = {
      0: 'Off',
      1: 'Track',
      2: 'Queue',
      3: 'Autoplay'
    };

    // Provide feedback to the user
    return interaction.reply({ 
      content: `Loop mode set to **${modeLabels[mode]}**.`, 
      ephemeral: true 
    });

  }
};
