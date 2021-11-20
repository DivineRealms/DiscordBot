module.exports = (client, oldRole, newRole) => {
    const log = client.channels.cache.get(client.conf.logging.Role_Updates);
    if (!log) return

    const embed = new client.embed()
        .setAuthor(`Role ${newRole.name} was updated!`)
        .setFooter(`Divine Realms`, client.user.displayAvatarURL({ size: 1024 }))

    if (oldRole.name !== newRole.name) log.send(embed.setDescription(`**Old Name:** ${oldRole.name}\n**New Name:** ${newRole.name}`))
    else if (oldRole.hexColor !== newRole.hexColor) log.send(embed.setDescription(`**Old Color:** ${oldRole.hexColor} (\`${oldRole.color}\`)\n**New Color:** ${newRole.hexColor} (\`${newRole.color}\`)`))
}