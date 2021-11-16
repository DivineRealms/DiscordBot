module.exports = {
    description: 'Add users to the current ticket.',
    aliases: []
}

module.exports.run = async(client, message, args) => {
    const ticket = client.settings.get(message.guild.id, `tickets.${message.channel.id}`)

    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(new client.embed().setDescription('You are missing the permission `Manage Channels`').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!ticket) return message.channel.send(new client.embed().setDescription('This command can only be used inside of tickets').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!message.mentions.users.first()) return message.channel.send(new client.embed().setDescription('Please mention a member to add to this ticket').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (message.channel.permissionOverwrites.has(message.mentions.users.first().id))
        if (message.channel.permissionOverwrites.get(message.mentions.users.first().id).allow.has('VIEW_CHANNEL')) return message.channel.send(new client.embed().setDescription('That user is already added to his ticket').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    message.channel.updateOverwrite(message.mentions.users.first(), { VIEW_CHANNEL: true })
    message.channel.send(new client.embed().setDescription(`${message.mentions.users.first()} has been added to the ticket!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
}