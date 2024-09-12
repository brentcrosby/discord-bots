const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer, QueryType } = require("discord-player");
const { BaseEmbed, ErrorEmbed } = require("../../modules/embeds.js");
const playerOptions = require("../../config/playerOptions.js");

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
      const channel = interaction.member?.voice?.channel;
      const checks = [
        {
          condition: !channel,
          message: "You need to join a voice channel first.",
        },
        {
          condition: !channel.viewable,
          message: "I need `View Channel` permission.",
        },
        {
          condition: !channel.speakable,
          message: "I need `Speak Channel` permission.",
        },
        {
          condition: !channel.joinable,
          message: "I need `Connect Channel` permission.",
        },
        {
          condition: channel.full,
          message: "Can't join, the voice channel is full.",
        },
        {
          condition: interaction.member.voice.deaf,
          message: "You cannot run this command while deafened.",
        },
        {
          condition: interaction.guild.members.me?.voice?.mute,
          message: "Please unmute me before playing.",
        },
      ];

      for (const check of checks) {
        if (check.condition)
          return interaction.reply({
            ephemeral: true,
            embeds: [ErrorEmbed(check.message)],
          });
      }
      
      const query = interaction.options.getString("query", true);
      let searchEngine = interaction.options.getString("source", false);
      const urlRegex = /^(https?):\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/\S*)?$/;
      if (!searchEngine || urlRegex.test(query)) searchEngine = QueryType.AUTO;
    
      const player = useMainPlayer();
    
      await interaction.deferReply();
    
      const result = await player.search(query, {
        searchEngine,
        requestedBy: interaction.user,
      });
    
      if (!result.hasTracks()) {
        return interaction.editReply({
          embeds: [ErrorEmbed(`No results found for \`${query}\`.`)],
        });
      }
    
      try {
        const { queue, track, searchResult } = await player.play(channel, result, {
          nodeOptions: {
            metadata: { channel: interaction.channel },
            ...playerOptions,
          },
          requestedBy: interaction.user,
          connectionOptions: { deaf: true },
        });
    
      const embed = BaseEmbed();
  
      if (searchResult.hasPlaylist()) {
        const playlist = searchResult.playlist;
        embed
          .setAuthor({
            name: `Playlist added - ${playlist.tracks.length} tracks.`,
            iconURL: playlist.thumbnail,
          })
          .setTitle(playlist.title)
          .setURL(playlist.url);
      } else {
        embed
          .setAuthor({
            name: `Track added - Position ${queue.node.getTrackPosition(track) + 1}`,
            iconURL: track.thumbnail,
          })
          .setTitle(track.title)
          .setURL(track.url);
      }
  
      return interaction.editReply({ embeds: [embed] }).catch(console.error);
    } catch (e) {
      console.error(e);
      return interaction.editReply({
        embeds: [ErrorEmbed(`Something went wrong while playing \`${query}\``)],
      });
    }
  }
}

