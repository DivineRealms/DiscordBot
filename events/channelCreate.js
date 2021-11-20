module.exports = (client, channel) => {
    const log = client.channels.cache.get(client.conf.logging.Channel_Updates);
    if (!log || !channel.guild) return

    const embed = new client.embed()
        .setAuthor('Channel was created')
        .setDescription(`**Channel name:** ${channel.name}\n**Channel ID:** \`${channel.id}\``)
        .setFooter(`Divine Realms`, client.user.displayAvatarURL({ size: 1024 }))

    log.send({ embeds: [embed] })
}