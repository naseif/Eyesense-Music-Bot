/**
 *
 * @param {number} duration
 * @returns
 */
module.exports.msToTime = (duration) => {
  let milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  if (duration < 3600000) {
    return minutes + ":" + seconds;
  } else {
    return hours + ":" + minutes + ":" + seconds;
  }
};
