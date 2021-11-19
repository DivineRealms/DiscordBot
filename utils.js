function formatTime(ms){
  let roundNumber = ms > 0 ? Math.floor : Math.ceil;
  let days = roundNumber(ms / 86400000),
  hours = roundNumber(ms / 3600000) % 24,
  mins = roundNumber(ms / 60000) % 60,
  secs = roundNumber(ms / 1000) % 60;
  var time = (days > 0) ? `${days}d ` : "";
  time += (hours > 0) ? `${hours}h ` : "";
  time += (mins > 0) ? `${mins}m ` : "";
  time += (secs > 0) ? `${secs}s` : "0s";
  return time;
}

module.exports = {
  formatTime,
}