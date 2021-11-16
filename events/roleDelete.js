module.exports = (client, role) => {
    const log = client.channels.cache.get(client.conf.logging.Role_Updates);
    if (!log) return

    const embed = new client.embed()
        .setAuthor('A role was deleted!')
        .setDescription(`**Role name:** ${role.name}\n**Role ID:** \`${role.id}\``)
        .setFooter(`${role.guild.name} | Made By Fuel#2649`, role.guild.iconURL({ dynamic: true }))

    log.send(embed)
}