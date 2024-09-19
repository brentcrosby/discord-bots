const { Events } = require("discord.js");

module.exports = {
  name: 'disconnect',
  execute(queue) {
    queue.metadata.channel.send(`That's all for now, stay groovy!`);
  }
};