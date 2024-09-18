const playerOptions = {
  volume: 30,
  repeatMode: 3,
  connectionOptions: { deaf: true },
  bufferingTimeout: 15000,
  noEmitInsert: true,
  leaveOnStop: true,
  leaveOnEmpty: true,
  leaveOnEmptyCooldown: 60_000,
  leaveOnEnd: true,
  leaveOnEndCooldown: 60_000,
  pauseOnEmpty: true,
  preferBridgedMetadata: true,
  disableBiquad: true,
  skipOnNoStream: true,
};

module.exports = { playerOptions };