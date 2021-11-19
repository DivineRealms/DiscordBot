module.exports = {
    description: 'Allows you to unban a member from the guild.',
    permissions: [],
    aliases: [`uban`],
    usage: 'unban <Member>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR"))
        return message.channel.send({ embeds: [new client.embed().setDescription(`You are missing permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});
    let channel = message.guild.channels.cache.get(client.conf.logging.Ban_Channel_Logs)
    let embed = new client.embed()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send({ embeds: [embed.setDescription(`Sorry! You\'re missing the permission \`BAN_MEMBERS\` to use this command.`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    const reason = args.slice(1).join(' ') || 'No Reason Specified'
    const member = await client.users.fetch(args[0]).catch(() => {})

    if (!member) return message.channel.send(embed.setDescription('Please enter a valid ID!'))

    await message.guild.bans.fetch(args[0]).then(() => {
        client.members.ensure(message.guild.id, client.memberSettings, member.id)
        const casenum = client.settings.get(message.guild.id, 'cases').length + 1
        const logEmbed = embed
            .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Member:** ${member.tag} - (${member.id})\n**Action:** Unban\n**Reason:** ${reason}`)
            .setFooter(`Case ${casenum} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true }))
            .setThumbnail(member.displayAvatarURL())
            .setColor(`GREEN`)
            .setTimestamp()
        client.members.push(message.guild.id, embed, `${member.id}.punishments`)
        client.settings.push(message.guild.id, embed, 'cases')
        message.channel.send(logEmbed)
        message.guild.members.unban(args[0], reason).catch(() => {})
        if (channel) channel.send(logEmbed)
    }).catch(() => {
        return message.channel.send({ embeds: [embed.setDescription('Sorry but.. that user is not banned in this guild.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    })
}