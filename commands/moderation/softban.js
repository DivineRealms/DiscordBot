module.exports = {
    description: 'Lets you ban the requested member from the guild.',
    aliases: [`bye`, `forceban`],
    usage: 'softban <@User | ID> <Reason>'
}

module.exports.run = async(client, message, args) => {
    let channel = message.guild.channels.cache.get(client.conf.logging.Ban_Channel_Logs)

    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(embed.setDescription('You can\'t use that you dumb fuck!'));
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(embed.setDescription(`Sorry, I am missing my required permissions perhaps try moving my role up!`));

    const member = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => {});

    if (!args[0]) return message.channel.send(embed.setDescription('Please specify a user to ban!'));
    if (!member) return message.channel.send(embed.setDescription('Sorry, I can\'t seem to find this user!'));
    if (member.id === message.author.id) return message.channel.send(embed.setDescription('Why are you trying to ban yourself?'))
    if (message.guild.member(member) && !message.guild.member(member).bannable) return message.channel.send(new client.embed().setDescription('I cant ban that user, my role must be higher in order to do that'))

    const reason = args.slice(1).join(" ") || 'No Reason Specified'
    const bans = client.members.ensure(message.guild.id, client.memberSettings, member.id).bans
    const casenum = client.settings.get(message.guild.id, 'cases').length + 1

    const embed = new client.embed()
        .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Member:** ${member.tag} - (${member.id})\n**Action:** Soft-Ban\n**Reason:** ${reason}\n**Ban Count:** ${(bans + 1)}`)
        .setFooter(`Case ${casenum} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true }))
        .setThumbnail(member.displayAvatarURL())
        .setColor(`RED`)
        .setTimestamp()

    await message.guild.members.ban(member, { reason })

    await message.channel.send(embed)
    if (channel) channel.send(embed)

    client.settings.push(message.guild.id, embed, 'cases')
    client.members.push(message.guild.id, embed.setTitle('Ban'), `${member.id}.punishments`)
    client.members.inc(message.guild.id, `${member.id}.bans`)
    const dm = await member.send(embed.setTitle('You have been soft-banned!')).catch(() => {})
    if (!dm) message.channel.send(new client.embed().setDescription(`Failed to send a dm to ${member}, their dms are locked. FUCK.. I WANTED TO PISS THEM OFF!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    message.guild.members.unban(member)

}