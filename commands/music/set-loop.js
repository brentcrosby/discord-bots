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
    .setDescription('Set the loop mode'),
  
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

    // Create buttons for each loop mode
    const offButton = new ButtonBuilder()
      .setCustomId('loop-off')
      .setLabel('Off')
      .setStyle(ButtonStyle.Secondary);

    const trackButton = new ButtonBuilder()
      .setCustomId('loop-track')
      .setLabel('Track')
      .setStyle(ButtonStyle.Success);

    const queueButton = new ButtonBuilder()
      .setCustomId('loop-queue')
      .setLabel('Queue')
      .setStyle(ButtonStyle.Primary);

    const autoplayButton = new ButtonBuilder()
      .setCustomId('loop-autoplay')
      .setLabel('Autoplay')
      .setStyle(ButtonStyle.Danger);

    // Arrange buttons in a row
    const row = new ActionRowBuilder()
      .addComponents(offButton, trackButton, queueButton, autoplayButton);

    // Send the buttons as a reply
    await interaction.reply({
      content: 'Select a loop mode:',
      components: [row],
      ephemeral: true, // Optional: Only the user can see this
    });
  }
};
