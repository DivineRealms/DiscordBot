module.exports = {
    description: 'Lets you ban the requested member from the guild.',
    permissions: [],
    aliases: ['yeet', 'forceban'],
    usage: 'ban <@user | ID> <Reason>'
}

module.exports.run = async(client, message, args) => {
    const channel = message.guild.channels.cache.get(client.conf.logging.Ban_Channel_Logs)

    if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [new client.embed().setDescription('You can\'t use that!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry, I am missing my required permissions perhaps try moving my role up!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    const member = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => {})

    if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to mention user.", "RED")] });
    if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Couldn't find that user.", "RED")] });
    if (member.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot ban yourself.", "RED")] });
    if (await message.guild.members.fetch(member).catch(() => {}) && !(await message.guild.members.fetch(member).bannable)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "I can't ban that user.", "RED")] });

    const reason = args.slice(1).join(" ") || 'No Reason'

    const embed = new client.embed()
        .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Member:** ${member.tag} - (${member.id})\n**Action:** Ban\n**Reason:** ${reason}\n**Ban Count:** ${(bans + 1)}`)
        .setThumbnail(member.displayAvatarURL())
        .setFooter(`Case ${casenum} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setColor(`RED`)

    message.guild.members.ban(member, { reason })
    await message.channel.send({ embeds: [embed] })
    if (channel) channel.send({ embeds: [embed] })

    const dm = await member.send(embed.setTitle('You have been banned!')).catch(() => {})
    if (!dm) message.channel.send({ embeds: [new client.embed().setDescription(`Failed to send a dm to ${member}, their dms are locked.`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    db.add(`cases_${message.guild.id}`, 1);
    db.push(`punishments_${message.guild.id}_${member.id}`, embed);
}