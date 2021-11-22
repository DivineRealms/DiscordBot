module.exports = (client, oldMember, newMember) => {
    const log = client.channels.cache.get(client.conf.logging.Role_Updates);
    const settings = client.conf.automation
    const channel = client.channels.cache.get(settings.Booster_Channel)
    const embed = new client.embed()
        .setAuthor('Guild member Update')
        .setFooter(`Divine Realms`, client.user.displayAvatarURL({ size: 1024 }))

    if (log && oldMember.nickname !== newMember.nickname) log.send({ embeds: [embed.setDescription(`**Old Nickname**: ${oldMember.displayName || 'none'}\n**New Name**: ${newMember.displayName}`)]});
    else if (log && [...newMember.roles.cache.keys()].join('') !== [...oldMember.roles.cache.keys()] .join('')) {
        let roles = oldMember.roles.cache.difference(newMember.roles.cache)
        
        const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
        const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));
        const added = addedRoles.map(r => r).join(", ");
        const removed = removedRoles.map(r => r).join(", ");
        
        embed.setAuthor(`${newMember.user.tag}'s roles were modified!`)
            .setDescription(`Added Roles - ${added || 'None'}\nRemoved Roles - ${removed || 'None'}`)
            .setFooter(`Divine Realms`, client.user.displayAvatarURL({ size: 1024 }))

        log.send({ embeds: [embed] })
    }

    if (newMember.guild.premiumSubscriptionCount !== oldMember.guild.premiumSubscriptionCount && newMember.premiumSince && newMember.premiumSince !== oldMember.premiumSince) {
        const boosters = newMember.guild.premiumSubscriptionCount

        const embed = new client.embed()
            .setTitle(settings.Booster_Title.replace(/{member}/, newMember.user.username))
            .setDescription(settings.Booster_Message.replace(/{member}/g, newMember.user.username).replace('{boosters}', boosters))
            .setThumbnail(settings.Booster_Thumbnail === '{member}' ? newMember.user.displayAvatarURL({ dynamic: true, format: 'png' }) : settings.Booster_Thumbnail || null)

        if (channel) channel.send({ embeds: [embed] }).catch(() => {})
    }
}