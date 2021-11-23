const db = require('quick.db')

module.exports = (client, channel) => {
    let ticket = db.fetch(`tickets_${channel.guild.id}_${channel.id}`);
    if(ticket) db.delete(`tickets_${channel.guild.id}_${channel.id}`);
    
    const log = client.channels.cache.get(client.conf.logging.Channel_Updates);
    if (!log) return

    const embed = new client.embedBuilder(client, message, "A channel was deleted!",
      `**Channel name:** ${channel.name}\n**Channel ID:** \`${channel.id}\``)

    log.send({ embeds: [embed] })
}