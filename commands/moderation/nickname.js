module.exports = {
    description: 'Allows you to set members nickname on the server.',
    aliases: [],
    usage: 'nickname <@user> <nickname>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('MANAGE_NICKNAMES')) return message.channel.send(new client.embed().setDescription(`Sorry you are missing the permission \`Manage Nicknames\`!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    const member = message.mentions.members.first()

    if (!member) message.channel.send(new client.embed().setDescription('You need to mention a member to change their nickname.'))
    if (member.id == message.guild.ownerID) message.channel.send(new client.embed().setDescription('You cant change the servers owner nickname.'))
    if (member.roles.highest.rawPosition >= message.member.roles.highest.position) message.channel.send(new client.embed().setDescription('You need to have a higher roles than that member to change their nickname.'))
    if (member.roles.highest.rawPosition >= message.member.roles.highest.position) message.channel.send(new client.embed().setDescription('I need to have a higher roles than that member to change their nickname.'))
    if (!args[0]) message.channel.send(new client.embed().setDescription('You need to enter something to set their nickname to.'))

    member.setNickname(args.slice(1).join(' ')).then(() => {
        message.channel.send(new client.embed().setDescription(`Successfully changed ${member.user.tag}'s nickname to \`${args.slice(1).join(' ')}\``))
    }).catch(() => {})
}