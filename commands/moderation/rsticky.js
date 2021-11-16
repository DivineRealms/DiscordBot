module.exports = {
    description: 'Removes a sticky message.',
    aliases: ['removesticky', 'stickyremove'],
    usage: 'rsticky'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(new client.embed().setDescription('You are missing the permission `Manage Channels`').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!client.settings.get(message.guild.id, `sticky.${message.channel.id}`)) return message.channel.send(new client.embed().setDescription('There arent any sticky messages on this channel!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    client.settings.delete(message.guild.id, `sticky.${message.channel.id}`)
    message.reply(`You deleted the sticky message for this channel!`)
}