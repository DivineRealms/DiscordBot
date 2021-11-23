module.exports = (client, oldChannel, newChannel) => {
    const log = client.channels.cache.get(client.conf.logging.Channel_Updates);
    if (!log) return

    const embed = new client.embedBuilder(client, message, `The Channel ${newChannel.name} was Updated!`, "")

    if (newChannel.name !== oldChannel.name) log.send({ embeds: [embed.setDescription(`**Old Name**: ${oldChannel.name}\n**New Name**: ${newChannel.name}`)]});
    else if (newChannel.nsfw !== oldChannel.nsfw) log.send({ embeds: [embed.setDescription(`${newChannel.name} is ${newChannel.nsfw ? 'now' : 'no longer'} set as **nsfw**`)]});
    else if (newChannel.rateLimitPerUser !== oldChannel.rateLimitPerUser) log.send({ embeds: [embed.setDescription(`**Old SlowMode**: ${client.utils.formatTime(oldChannel.rateLimitPerUser * 1000)}\n**New SlowMode**: ${client.utils.formatTime(newChannel.rateLimitPerUser * 1000)}`)]});
    else if (newChannel.name !== oldChannel.name) log.send({ embeds: [embed.setDescription(`**Old Name**: ${oldChannel.name}\n**New Name**: ${newChannel.name}`)]});
}