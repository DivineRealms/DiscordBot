const db = require('quick.db')

module.exports = (client, channel) => {
    let ticket = db.fetch(`tickets_${channel.guild.id}_${channel.id}`);
    if(ticket) db.delete(`tickets_${channel.guild.id}_${channel.id}`);
    
    const log = client.channels.cache.get(client.conf.logging.Channel_Updates);
    if (!log) return

    const embed = new client.embed()
        .setAuthor('A channel was deleted!')
        .setDescription(`**Channel name:** ${channel.name}\n**Channel ID:** \`${channel.id}\``)
        .setFooter(`Divine Realms`, client.user.displayAvatarURL({ size: 1024 }))

    log.send({ embeds: [embed] })
}