module.exports = (client, oldChannel, newChannel) => {
    const log = client.channels.cache.get(client.conf.logging.Channel_Updates);
    if (!log) return

    const embed = new client.embed()
        .setAuthor(`The Channel ${newChannel.name} was Updated!`)
        .setFooter(`Divine Realms`, client.user.displayAvatarURL({ size: 1024 }))

    if (newChannel.name !== oldChannel.name) log.send({ embeds: [embed.setDescription(`**Old Name**: ${oldChannel.name}\n**New Name**: ${newChannel.name}`)]});
    else if (newChannel.nsfw !== oldChannel.nsfw) log.send({ embeds: [embed.setDescription(`${newChannel.name} is ${newChannel.nsfw ? 'now' : 'no longer'} set as **nsfw**`)]});
    else if (newChannel.rateLimitPerUser !== oldChannel.rateLimitPerUser) log.send({ embeds: [embed.setDescription(`**Old SlowMode**: ${client.utils.formatTime(oldChannel.rateLimitPerUser * 1000)}\n**New SlowMode**: ${client.utils.formatTime(newChannel.rateLimitPerUser * 1000)}`)]});
    else if (newChannel.name !== oldChannel.name) log.send({ embeds: [embed.setDescription(`**Old Name**: ${oldChannel.name}\n**New Name**: ${newChannel.name}`)]});
}