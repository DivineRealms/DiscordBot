module.exports = {
    description: 'Kicks the requested member from the server.',
    aliases: [`forcekick`],
    usage: 'N?A'
}

module.exports.run = async(client, message, args) => {
    let channel = message.guild.channels.cache.get(client.conf.logging.Kick_Channel_Logs)

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(new client.embed().setDescription('You can\'t use that you dumb fuck!'));
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send(new client.embed().setDescription(`Sorry, I am missing my required permissions perhaps try moving my role up!`));

    const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});

    if (!args[0]) return message.channel.send(new client.embed().setDescription('Please specify a user to kick!'));
    if (!member) return message.channel.send(new client.embed().setDescription('Sorry, I can\'t seem to find this user!'));
    if (member.id === message.author.id) return message.channel.send(new client.embed().setDescription('Why are you trying to kick yourself?'))
    if (!member.kickable) return message.channel.send(new client.embed().setDescription('I cant kick that user, my role must be higher in order to do that.'))

    const reason = args.slice(1).join(" ") || 'Unspecified'
    const kicks = client.members.ensure(message.guild.id, client.memberSettings, member.id).kicks
    const casenum = client.settings.get(message.guild.id, 'cases').length + 1

    const embed = new client.embed()
        .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Member:** ${member.user.tag} - (${member.id})\n**Action:** Kick\n**Reason:** ${reason}\n**Kick Count**: ${kicks + 1}`)
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(`#FF8C00	`)
        .setFooter(`Case ${casenum} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true }))

    await message.channel.send(embed)
    if (channel) channel.send(embed)
    client.settings.push(message.guild.id, embed, 'cases')
    client.members.push(message.guild.id, embed.setTitle('Kick'), `${member.id}.punishments`)
    client.members.inc(message.guild.id, `${member.id}.kicks`)
    const dm = await member.send(embed.setTitle('You have been kicked!')).catch(() => {})
    if (!dm) message.channel.send(new client.embed().setDescription(`Failed to send a dm to ${member}, their dms are locked. FUCK.. I WANTED TO PISS THEM OFF!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    member.kick().catch(() => {})
}