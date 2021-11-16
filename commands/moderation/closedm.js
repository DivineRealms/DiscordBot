module.exports = {
    description: 'Closes a users DM on the server.',
    aliases: [],
    usage: 'closedm'
}

module.exports.run = async(client, message, args) => {

    const embed = new client.embed()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    let dmchannel = Object.entries(client.settings.get(message.guild.id, 'dms')).find(([, obj]) => obj.channel === message.channel.id)
    if (!dmchannel) return message.channel.send(embed.setDescription('This isnt a dm channel.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    message.channel.send(embed.setDescription('This channel will be deleted in 10 seconds.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    client.settings.delete(message.guild.id, `dms.${dmchannel[1].user}`)

    await new Promise(r => setTimeout(r, 10000))
    message.channel.delete().catch(() => {})
}