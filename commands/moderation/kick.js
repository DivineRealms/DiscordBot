module.exports = {
    description: 'Kicks the requested member from the server.',
    permissions: [],
    aliases: [`forcekick`],
    usage: 'N?A'
}

module.exports.run = async(client, message, args) => {
    let channel = message.guild.channels.cache.get(client.conf.logging.Kick_Channel_Logs)

    if (!message.guild.me.permissions.has("KICK_MEMBERS")) return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry, I am missing my required permissions perhaps try moving my role up!`)]});

    const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});

    if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide user to kick.", "RED")] });
    if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That User couldn't be found.", "RED")] });
    if (member.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot kick yourself.", "RED")] });
    if (!member.kickable) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That User cannot be kicked.", "RED")] });

    const reason = args.slice(1).join(" ") || 'No Reason'
    const cases = db.fetch(`cases_${message.guild.id}`) + 1;

    const embed = new client.embed()
        .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Member:** ${member.user.tag} - (${member.id})\n**Action:** Kick\n**Reason:** ${reason}\n**Kick Count**: ${kicks + 1}`)
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(`#FF8C00	`)
        .setFooter(`Case ${casenum} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true }))

    await message.channel.send({ embeds: [embed] })
    if (channel) channel.send({ embeds: [embed] })
    
    db.push(`punishments_${message.guild.id}_${member.id}`, embed);
    db.add(`cases_${message.guild.id}`, 1);
    
    const dm = await member.send(embed.setTitle('You have been kicked!')).catch(() => {})
    if (!dm) message.channel.send({ embeds: [new client.embed().setDescription(`Failed to send a dm to ${member}, their dms are locked. FUCK.. I WANTED TO PISS THEM OFF!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    member.kick().catch(() => {})
}