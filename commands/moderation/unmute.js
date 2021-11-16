module.exports = {
    description: 'Lets you unmute the requested user.',
    aliases: ['um'],
    usage: 'unmute <@User> [reason]'
}

module.exports.run = async(client, message, args) => {
    const member = message.mentions.members.first() || message.guild.member(args[0])
    const muterole = message.guild.roles.cache.get(client.conf.moderation.Mute_Role)
    const log = client.channels.cache.get(client.conf.logging.Mute_Channel_Logs)
    const reason = args.slice(1).join(' ') || 'No Reason Specified'
    if (!message.member.hasPermission("MUTE_MEMBERS"))
        return message.channel.send(new client.embed().setDescription(`You are missing permission \`MUTE_MEMBERS\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    if (!member) return message.channel.send(new client.embed().setDescription('Please put a valid member or a user ID for me to unmute').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!muterole) return message.channel.send(new client.embed().setDescription('I cant find the mute role on the server!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (member.id === message.author.id) return message.channel.send(new client.embed().setDescription('Stop being a dumbass... You can\'t unmute yourself.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (member.user.bot) return message.channel.send(new client.embed().setDescription('You can\'t unmute a bot!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (member.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send(new client.embed().setDescription('You can only unmute members that have a lower role than you.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (member.hasPermission('ADMINISTRATOR') || member.roles.highest.rawPosition >= message.guild.me.roles.highest.rawPosition) return message.channel.send(new client.embed().setDescription('I cant unmute that member').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!member.roles.cache.has(muterole.id)) return message.channel.send(new client.embed().setDescription('That member is already unmuted!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    client.members.ensure(message.guild.id, client.memberSettings, member.id)

    await member.roles.remove(muterole)
    client.members.set(message.guild.id, { muted: false, mutedAt: null }, `${member.id}.muted`)
    const casenum = client.settings.get(message.guild.id, 'cases').length + 1
    const embed = new client.embed()
        .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Member:** ${member.user.tag} - (${member.user.id})\n**Action:** Unmute\n**Reason:** ${reason}`)
        .setFooter(`Case ${casenum} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true }))
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(`GREEN`)
        .setTimestamp()

    let embed2 = embed
    client.members.push(message.guild.id, embed, `${member.id}.warns`)
    client.members.push(message.guild.id, embed, `${member.id}.punishments`)
    client.settings.push(message.guild.id, embed, 'cases')
    if (log) log.send(embed)
    await message.channel.send(embed)
    let dm = await member.send(embed2.setTitle(`You have been unmuted`)).catch(() => {})
    if (!dm) message.channel.send(new client.embed().setDescription(`Failed to send dm to ${member}, they have dms off!`))
}