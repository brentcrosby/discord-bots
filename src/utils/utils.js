/**
 * Parses a time string in 'mm:ss' format to milliseconds.
 * @param {string} timeStr - The time string to parse (e.g., '03:45').
 * @returns {number} - The total time in milliseconds.
 * @throws Will throw an error if the input format is invalid.
*/

function parseTimeToMs(timeStr) {
  // Define a regex pattern to match 'mm:ss' format
  const regex = /^(\d{1,2}):([0-5]\d)$/;
  const match = timeStr.match(regex);

  if (!match) {
    throw new Error("Invalid time format. Please use 'mm:ss'.");
  }

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);

  // Validate minute and second ranges
  if (minutes < 0 || seconds < 0 || seconds >= 60) {
    throw new Error("Invalid time values. Minutes should be >= 0 and seconds should be between 00 and 59.");
  }

  const totalMs = (minutes * 60 + seconds) * 1000;
  return totalMs
}

module.exports = {
  parseTimeToMs,
};