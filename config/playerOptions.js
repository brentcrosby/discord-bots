const playerOptions = {
  volume: 30,
  repeatMode: 3,
  connectionOptions: { deaf: true },
  noEmitInsert: true,
  leaveOnStop: false,
  leaveOnEmpty: true,
  leaveOnEmptyCooldown: 60_000,
  leaveOnEnd: true,
  leaveOnEndCooldown: 60_000,
  pauseOnEmpty: true,
  preferBridgedMetadata: true,
  disableBiquad: true,
};

module.exports = { playerOptions };