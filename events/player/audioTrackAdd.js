const { Events } = require("discord.js");

module.exports = {
  name: 'audioTrackAdd',
  execute(queue, track) {
    queue.metadata.channel.send(`Track **${track.title}** coming up. Position: ${queue.node.getTrackPosition(track) + 1}`);
    queue.setRepeatMode(3);
  }
};