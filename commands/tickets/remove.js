const db = require('quick.db')

module.exports = {
    name: 'remove',
    category: 'tickets',
    description: 'Remove a user from a ticket.',
    permissions: ["MANAGE_CHANNELS"],
    cooldown: 0,
    aliases: []
}

module.exports.run = async(client, message, args) => {
    const ticket = db.fetch(`tickets_${message.guild.id}_${message.channel.id}`);

    if (!ticket) return message.channel.send({ embeds: [new client.embed().setDescription('This command can only be used inside of tickets.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!message.mentions.users.first()) return message.channel.send({ embeds: [new client.embed().setDescription('Please mention a member to remove to this ticket.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!message.channel.permissionOverwrites.has(message.mentions.users.first().id)) return message.channel.send({ embeds: [new client.embed().setDescription('That user isnt in this ticket.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    message.channel.permissionOverwrites.get(message.mentions.users.first().id).delete()
    message.channel.send({ embeds: [new client.embed().setDescription(`${message.mentions.users.first()} has been removed to the ticket!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
}