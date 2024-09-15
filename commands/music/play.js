const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer, QueryType, useQueue } = require("discord-player");


module.exports = {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or playlist from url or name')
    .addStringOption(option =>
			option.setName('query')
				.setDescription('The name or url of the song, you want to play.')
				.setRequired(true)),
  async execute (interaction) {

    // Setup player and channel
    const player = useMainPlayer();
    const channel = interaction.member.voice.channel;
    const query = interaction.options.getString('query');


    // Check for voice channel
    if (!channel) {
      return interaction.reply('You are not connected to a voice channel!');
    }

    // Defer interaction so the request has time to process
    await interaction.deferReply();

    // Search for song
    const result = await player.search(query, {
      requestedBy: interaction.user,
    });
  
    if (!result.hasTracks()) {
      return interaction.editReply(`No results found for \`${query}\`.`);
    }


    try {
      const { track } = await player.play(channel, result, {
        nodeOptions: {
          metadata: interaction,
          connectionOptions: { deaf: true },
        }
      });
      
      return interaction.followUp(`**${track.title}** enqueued!`);
    } catch (e) {
      // Return error if something failed
      return interaction.followUp(`Something went wrong: ${e}`);
    }

  }
};
