module.exports = {
    description: 'Lets you ban the requested member from the guild.',
    aliases: ['yeet', 'forceban'],
    usage: 'ban <@user | ID> <Reason>'
}

module.exports.run = async(client, message, args) => {
    const channel = message.guild.channels.cache.get(client.conf.logging.Ban_Channel_Logs)

    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(new client.embed().setDescription('You can\'t use that!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(new client.embed().setDescription(`Sorry, I am missing my required permissions perhaps try moving my role up!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    const member = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => {})

    if (!args[0]) return message.channel.send(new client.embed().setDescription('Please specify a user to ban!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    if (!member) return message.channel.send(new client.embed().setDescription('Sorry, I can\'t seem to find this user!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    if (member.id === message.author.id) return message.channel.send(new client.embed().setDescription('Why are you trying to ban yourself?').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (member.tag === 'Fuel#2649') return message.channel.send(new client.embed().setDescription('Why are you trying to ban my creator.. You\'re dumb lmao..').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (await message.guild.members.fetch(member).catch(() => {}) && !(await message.guild.members.fetch(member).bannable)) return message.channel.send(new client.embed().setDescription('I cant ban that member!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    const reason = args.slice(1).join(" ") || 'Unspecified'
    const bans = client.members.ensure(message.guild.id, client.memberSettings, member.id).bans
    const casenum = client.settings.get(message.guild.id, 'cases').length + 1

    const embed = new client.embed()
        .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Member:** ${member.tag} - (${member.id})\n**Action:** Ban\n**Reason:** ${reason}\n**Ban Count:** ${(bans + 1)}`)
        .setThumbnail(member.displayAvatarURL())
        .setFooter(`Case ${casenum} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setColor(`RED`)

    client.members.ensure(message.guild.id, client.memberSettings, member.id)

    message.guild.members.ban(member, { reason })
    await message.channel.send(embed)
    if (channel) channel.send(embed)

    const dm = await member.send(embed.setTitle('You have been banned!')).catch(() => {})
    if (!dm) message.channel.send(new client.embed().setDescription(`Failed to send a dm to ${member}, their dms are locked.`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    client.settings.push(message.guild.id, embed, 'cases')
    client.members.push(message.guild.id, embed, `${member.id}.punishments`)
    client.members.inc(message.guild.id, `${member.id}.bans`)
}