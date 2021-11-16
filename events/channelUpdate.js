const dur = require('humanize-duration')

module.exports = (client, oldChannel, newChannel) => {
    const log = client.channels.cache.get(client.conf.logging.Channel_Updates);
    if (!log) return

    const embed = new client.embed()
        .setAuthor(`The Channel ${newChannel.name} was Updated!`)
        .setFooter(`${oldChannel.guild.name} | Made By Fuel#2649`, oldChannel.guild.iconURL({ dynamic: true }))

    const overwrites = oldChannel.permissionOverwrites.difference(newChannel.permissionOverwrites)

    if (newChannel.name !== oldChannel.name) log.send(embed.setDescription(`**Old Name**: ${oldChannel.name}\n**New Name**: ${newChannel.name}`));
    else if (newChannel.nsfw !== oldChannel.nsfw) log.send(embed.setDescription(`${newChannel.name} is ${newChannel.nsfw ? 'now' : 'no longer'} set as **nsfw**`));
    else if (newChannel.rateLimitPerUser !== oldChannel.rateLimitPerUser) log.send(embed.setDescription(`**Old SlowMode**: ${dur(oldChannel.rateLimitPerUser * 1000)}\n**New SlowMode**: ${dur(newChannel.rateLimitPerUser * 1000)}`));
    else if (newChannel.name !== oldChannel.name) log.send(embed.setDescription(`**Old Name**: ${oldChannel.name}\n**New Name**: ${newChannel.name}`));
    else if (overwrites.size) log.send(embed.setDescription(`
    **New Permission Overwrites:**\n${overwrites.filter(p => newChannel.permissionOverwrites.has(p.id)).map(s => s.type === 'role' ? oldChannel.guild.roles.cache.get(s.id).toString() : client.users.cache.get(s.id).toString()).join(' ') || 'None'}\n
    **Removed Permission Overwrites:**\n${overwrites.filter(p => !newChannel.permissionOverwrites.has(p.id)).map(s => s.type === 'role' ? oldChannel.guild.roles.cache.get(s.id).toString() : client.users.cache.get(s.id).toString()).join(' ') || 'None'}
    `));

}