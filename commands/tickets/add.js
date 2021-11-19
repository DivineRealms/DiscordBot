module.exports = {
    description: 'Add users to the current ticket.',
    permissions: [],
    aliases: []
}

module.exports.run = async(client, message, args) => {
    const ticket = client.settings.get(message.guild.id, `tickets.${message.channel.id}`)

    if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You don't have permission required.", "RED")] });
    if (!ticket) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "This command can only be used in Ticket Channel.", "RED")] });
    if (!message.mentions.users.first()) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to mention user to add to ticket.", "RED")] });
    if (message.channel.permissionOverwrites.has(message.mentions.users.first().id))
        if (message.channel.permissionOverwrites.get(message.mentions.users.first().id).allow.has('VIEW_CHANNEL')) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That User is already added in Ticket.", "RED")] });

    message.channel.updateOverwrite(message.mentions.users.first(), { VIEW_CHANNEL: true })
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Add", `${message.mentions.users.first()} have been added to ticket.`, "YELLOW")] });
}