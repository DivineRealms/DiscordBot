module.exports = (client, role) => {
    const log = client.channels.cache.get(client.conf.logging.Role_Updates);
    if (!log) return

    const embed = new client.embed()
        .setAuthor('Role was created!')
        .setDescription(`**Role name:** ${role.name}\n**Role ID:** \`${role.id}\``)
        .setFooter(`Divine Realms`, client.user.displayAvatarURL({ size: 1024 }))

    log.send({ embeds: [embed] })
}