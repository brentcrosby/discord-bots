const { Events } = require("discord.js");

module.exports = {
  name: 'playerStart',
  execute(queue, track) {
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
    queue.setRepeatMode(3);
  }
};