const { Events } = require("discord.js");

module.exports = {
  name: 'audioTrackAdd',
  execute(queue, track) {
    queue.metadata.channel.send(`Track **${track.title}** queued. Position: ${queue.node.getTrackPosition(track) + 1}`);
    queue.setRepeatMode(3);
  }
};