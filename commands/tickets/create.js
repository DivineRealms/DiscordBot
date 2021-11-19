module.exports = {
    description: 'Creates a ticket.',
    permissions: [],
    aliases: [`new`, `ticket`],
    usage: 'create <@users>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.senD({ embeds: [new client.embed().setDescription('You are missing the permission `Manage Channels`').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    const settings = client.conf.ticketSystem
    const tickets = client.settings.get(message.guild.id, 'tickets')
    const log = client.channels.cache.get(client.conf.logging.Ticket_Channel_Logs)
    const num = Object.entries(tickets).length || 1
    const ticketNumber = '0'.repeat(4 - num.toString().length) + num
    const permissions = settings.Support_Team_Roles.map(r => ({ id: r, allow: 'VIEW_CHANNEL' }))
    const users = message.mentions.users.map(s => ({ id: s.id, allow: 'VIEW_CHANNEL' }))
    const channel = await message.guild.channels.create(settings.Ticket_Name.replace('{number}', ticketNumber).replace('{username}', message.author.username), {
        parent: settings.Ticket_Category,
        permissionOverwrites: [{
            id: message.guild.id,
            deny: 'VIEW_CHANNEL'
        }, { id: message.author.id, allow: 'VIEW_CHANNEL' }, ...permissions, ...users]
    })

    channel.send({ embeds: [new client.embed()
        .setTitle(settings.Ticket_Title)
        .setDescription(client.resolveMember(settings.Ticket_Message, message.author))
    ]})

    if (log) log.send({ embeds: [new client.embed()
        .setTitle('Ticket Created')
        .setDescription(`**Creator:** ${message.author}`)]});
    
    db.set(`tickets_${message.guild.id}_${message.author.id}`, message.author.id);
}