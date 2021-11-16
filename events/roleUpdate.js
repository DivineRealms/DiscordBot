module.exports = (client, oldRole, newRole) => {
    const log = client.channels.cache.get(client.conf.logging.Role_Updates);
    if (!log) return

    const embed = new client.embed()
        .setAuthor(`The role ${newRole.name} was updated!`)
        .setFooter(`${newRole.guild.name} | Made By Fuel#2649`, newRole.guild.iconURL({ dynamic: true }))

    if (oldRole.name !== newRole.name) log.send(embed.setDescription(`**Old Name:** ${oldRole.name}\n**New Name:** ${newRole.name}`))
    else if (oldRole.hexColor !== newRole.hexColor) log.send(embed.setDescription(`**Old Color:** ${oldRole.hexColor} (\`${oldRole.color}\`)\n**New Color:** ${newRole.hexColor} (\`${newRole.color}\`)`))
}