module.exports = {
    name: 'lockserver',
    category: 'moderation',
    description: 'Lock the server, kicking anyone who joins.',
    permissions: ["ADMINISTRATOR"],
    cooldown: 0,
    aliases: [`serverlock`],
    usage: 'lockserver'
}

module.exports.run = (client, message, args) => {
    const locked = client.settings.get(message.guild.id, 'locked')
    if (!client.conf.moderation.serverLock) return message.channel.send({ embeds: [new client.embed().setDescription('This command is disabled, enable it in the configuration.')]})

    const embed1 = new client.embed()

    .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Action:** Server Lock\n**Status:** ${!locked ? 'Locked' : 'Unlocked'}\n**Time:** ${require('moment')().format('ddd, MMMM Do YYYY [at] hh:mm A')}`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(`RED`)

    message.channel.send({ embeds: [embed1] })
    client.settings.set(message.guild.id, !locked, 'locked')

}