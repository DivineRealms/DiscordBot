const db = require('quick.db')
const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name: 'create',
    category: 'tickets',
    description: 'Creates a ticket.',
    permissions: ["MANAGE_CHANNELS"],
    cooldown: 0,
    aliases: [`new`, `ticket`],
    usage: 'create <@users>'
}

module.exports.run = async(client, message, args) => {   const settings = client.conf.ticketSystem
    const tickets = db.all().filter(i => i.ID.startsWith(`tickets_${message.guild.id}_`)) || [];
    const log = client.channels.cache.get(client.conf.logging.Ticket_Channel_Logs)
    const num = tickets.length || 1
    const ticketNumber = '0'.repeat(4 - num.toString().length) + num
    if (tickets.find((u) => u.data.includes(message.author.id))) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You already have an ticket opened.", "RED")] });
    const permissions = settings.Support_Team_Roles.map(r => ({ id: r, allow: 'VIEW_CHANNEL' }))
    const users = message.mentions.users.map(s => ({ id: s.id, allow: 'VIEW_CHANNEL' }))
    const channel = await message.guild.channels.create(settings.Ticket_Name.replace('{number}', ticketNumber).replace('{username}', message.author.username), {
        parent: settings.Ticket_Category,
        permissionOverwrites: [{
            id: message.guild.id,
            deny: 'VIEW_CHANNEL'
        }, { id: message.author.id, allow: 'VIEW_CHANNEL' }, ...permissions, ...users]
    })

    const jumpRow = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(`https://discord.com/channels/${message.guild.id}/${channel.id}`)
        .setLabel("Go to Ticket")
        .setStyle('LINK')
    );

    message.channel.send({ embeds: [client.embedBuilder(client, message, "Ticket Created", `Ticket have been successfully created in channel ${channel}.`, "YELLOW")], components: [jumpRow] });

    channel.send({ embeds: [new client.embed()
        .setTitle(settings.Ticket_Title)
        .setDescription(client.resolveMember(settings.Ticket_Message, message.author))
    ]})

    if (log) log.send({ embeds: [new client.embed()
        .setTitle('Ticket Created')
        .setDescription(`**Creator:** ${message.author}`)]});
    
    db.set(`tickets_${message.guild.id}_${message.channel.id}`, message.author.id);
}