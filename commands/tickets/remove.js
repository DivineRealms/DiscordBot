module.exports = {
    description: 'Remove a user from a ticket.',
    permissions: [],
    aliases: []
}

module.exports.run = async(client, message, args) => {
    const ticket = client.settings.get(message.guild.id, `tickets.${message.channel.id}`)

    if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send({ embeds: [new client.embed().setDescription('You are missing the permission `Manage Channels`').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!ticket) return message.channel.send({ embeds: [new client.embed().setDescription('This command can only be used inside of tickets.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!message.mentions.users.first()) return message.channel.send({ embeds: [new client.embed().setDescription('Please mention a member to remove to this ticket.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!message.channel.permissionOverwrites.has(message.mentions.users.first().id)) return message.channel.send({ embeds: [new client.embed().setDescription('That user isnt in this ticket.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    message.channel.permissionOverwrites.get(message.mentions.users.first().id).delete()
    message.channel.send({ embeds: [new client.embed().setDescription(`${message.mentions.users.first()} has been removed to the ticket!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
}