module.exports = (client, oldMember, newMember) => {
    const log = client.channels.cache.get(client.conf.logging.Role_Updates);
    const settings = client.conf.automation
    const channel = client.channels.cache.get(settings.Booster_Channel)
    const embed = new client.embed()
        .setAuthor('Guild member update!')
        .setFooter(`${oldMember.guild.name} | Made By Fuel#2649`, oldMember.guild.iconURL({ dynamic: true }))

    if (log && oldMember.nickname !== newMember.nickname) log.send(embed.setDescription(`**Old Nickname**: ${oldMember.displayName || 'none'}\n**New Name**: ${newMember.displayName}`));
    else if (log && newMember.roles.cache.keyArray().join('') !== oldMember.roles.cache.keyArray().join('')) {
        let roles = oldMember.roles.cache.difference(newMember.roles.cache)
        embed.setAuthor(`${newMember.user.tag}'s roles were modified!`)
            .setDescription(`Added Roles - ${roles.filter(r => !oldMember.roles.cache.has(r.id)).map(s => s.toString()).join(' ') || 'None'}\nRemoved Roles - ${roles.filter(r => !newMember.roles.cache.has(r.id)).map(s => s.toString()).join(' ') || 'None'}`)
            .setFooter(`${newMember.guild.name} | Made By Fuel#2649`, newMember.guild.iconURL({ dynamic: true }))

        log.send(embed)
    }

    if (newMember.guild.premiumSubscriptionCount !== oldMember.guild.premiumSubscriptionCount && newMember.premiumSince && newMember.premiumSince !== oldMember.premiumSince) {
        const boosters = newMember.guild.premiumSubscriptionCount

        const embed = new client.embed()
            .setTitle(settings.Booster_Title.replace(/{member}/, newMember.user.username))
            .setDescription(settings.Booster_Message.replace(/{member}/g, newMember.user.username).replace('{boosters}', boosters))
            .setThumbnail(settings.Booster_Thumbnail === '{member}' ? newMember.user.displayAvatarURL({ dynamic: true, format: 'png' }) : settings.Booster_Thumbnail || null)

        if (channel) channel.send(embed).catch(() => {})
    }
}