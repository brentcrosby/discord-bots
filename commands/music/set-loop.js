const { SlashCommandBuilder } = require('discord.js');
const { ensureActiveQueueAndChannel } = require('../../utils/musicUtils');
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

    // Ensure the user is in a voice channel and there is an active queue
    const check = await ensureActiveQueueAndChannel(interaction);
    if (!check) return;


    // Get option and set loop mode
    const mode = interaction.options.getInteger('loop-mode');
    const queue = useQueue(interaction.guild.id);
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
