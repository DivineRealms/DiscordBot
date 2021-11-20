const db = require('quick.db');

module.exports = {
    name: 'add',
    description: 'Add users to the current ticket.',
    permissions: ["MANAGE_CHANNELS"],
    cooldown: 0,
    aliases: []
}

module.exports.run = async(client, message, args) => {
    const ticket = db.fetch(`tickets_${message.guild.id}_${message.channel.id}`);

    if (!ticket) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "This command can only be used in Ticket Channel.", "RED")] });
    if (!message.mentions.users.first()) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to mention user to add to ticket.", "RED")] });
    if (message.channel.permissionOverwrites.has(message.mentions.users.first().id))
        if (message.channel.permissionOverwrites.get(message.mentions.users.first().id).allow.has('VIEW_CHANNEL')) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That User is already added in Ticket.", "RED")] });

    message.channel.permissionOverwrites.edit(message.mentions.users.first(), { VIEW_CHANNEL: true })
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Add", `${message.mentions.users.first()} have been added to ticket.`, "YELLOW")] });
}