const Discord = require('discord.js')
const db = require('quick.db')

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

function commandsList(client, message, category) {
  let commands = client.commands.filter(
    c => c.category == category && c.category != "owner"
  );
  let content = "";
  
  commands.forEach(
    c => (content += `\`${message.px}${c.usage}\` · ${c.description}\n`)
  );
  
  return content;
}

const logs = (client, guild, type, fields, user) => {
  const aChannel = client.channels.cache.get(client.conf.logging.Moderation_Channel_Logs)
  
  let embed = client.embedBuilder(client, message, user.username, `Logging Type - \`${type}\``)
    
  for(var i = 0; i < fields.length; i++) {
    embed.addField(fields[i].name + "", fields[i].desc + "");
  }

  if(aChannel) aChannel.send({ embeds: [embed] });
}

module.exports = {
  formatTime,
  logs,
  commandsList
}