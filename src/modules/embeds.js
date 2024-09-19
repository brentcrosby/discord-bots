const { Colors, EmbedBuilder } = require("discord.js");

module.exports = {
  Colors,
  
  /**
   * Creates a base embed with the given data and color.
   */
  BaseEmbed: ({ data = {}, color = Colors.Blurple } = {}) =>
    new EmbedBuilder(data).setColor(color),

  /**
   * Creates an error embed.
   */
  ErrorEmbed: (text) =>
    new EmbedBuilder({ description: text }).setColor(Colors.Red),

  /**
   * Creates a success embed.
   */
  SuccessEmbed: (text) =>
    new EmbedBuilder({ description: text }).setColor(Colors.Green),

  /**
   * Creates a warning embed.
   */
  WarningEmbed: (text) =>
    new EmbedBuilder({ description: text }).setColor(Colors.DarkOrange),

  /**
   * Creates an informational embed.
   */
  InfoEmbed: (text) =>
    new EmbedBuilder({ description: text }).setColor(Colors.Blurple),
};
