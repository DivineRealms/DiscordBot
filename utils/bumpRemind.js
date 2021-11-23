const db = require("quick.db");

const bump = (client) => {
  setInterval(async() => {
    let time = db.fetch(`serverBump_${client.conf.settings.guildID}`);
    if(time && Date.now() > time) {
      let bumpChannel = client.channels.cache.get(client.conf.logging.Bump_Channel)
      let embed = client.embedBuilder(client, null, "Server Bump", "Server can be bumped again, use `!d bump`")
      
      db.delete(`serverBump_${client.conf.settings.guildID}`)
      if(bumpChannel) bumpChannel.send({ embeds: [embed] });
    }
  }, 30000)
}

module.exports = {
  bump
}