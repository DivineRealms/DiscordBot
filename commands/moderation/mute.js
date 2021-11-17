const ms = require('parse-duration')

module.exports = {
    description: 'Lets you mute the requested user.',
    aliases: ['stopspeaking'],
    usage: 'mute <@User> [time | reason] [reason]'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission("MUTE_MEMBERS"))
        return message.channel.send(new client.embed().setDescription(`You are missing permission \`MUTE_MEMBERS\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    const member = message.mentions.members.first() || message.guild.member(args[0])
    const muterole = message.guild.roles.cache.get(client.conf.moderation.Mute_Role)
    const time = ms(args[1])
    const mutereason = args.slice(time ? 2 : 1).join(' ') || 'No Reason Provided'
    const log = client.channels.cache.get(client.conf.logging.Mute_Channel_Logs)

    if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter valid user.", "RED")] });
    if (!muterole) return message.channel.send(new client.embed().setDescription('I cant find the mute role on the server!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (member.id === message.author.id) return message.channel.send(new client.embed().setDescription('Stop being a dumbass... You can\'t mute yourself.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (member.user.bot) return message.channel.send(new client.embed().setDescription('You can\'t mute a bot!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (member.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send(new client.embed().setDescription('You can only mute members that have a lower role than you.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (member.hasPermission('ADMINISTRATOR') || member.roles.highest.rawPosition >= message.guild.me.roles.highest.rawPosition) return message.channel.send(new client.embed().setDescription('I cant mute that member').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (member.roles.cache.has(muterole.id)) return message.channel.send(new client.embed().setDescription('That member is already muted!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    client.members.ensure(message.guild.id, client.memberSettings, member.id)

    await member.roles.add(muterole)
    client.members.set(message.guild.id, { muted: true, mutedAt: time ? Date.now() + time : null }, `${member.id}.muted`)

    if (time) setTimeout(() => {
        client.members.set(message.guild.id, { muted: false, mutedAt: null }, `${member.id}.muted`)
        member.roles.remove(muterole).catch(() => {})
    }, time)
    const casenum = client.settings.get(message.guild.id, 'cases').length + 1
    const embed = new client.embed()
        .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Member:** ${member}\n**Action:** Mute\n**Reason:** ${mutereason}`)
        .setFooter(`Case ${casenum} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true }))
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(`YELLOW`)

    if (log) log.send(embed)
    await message.channel.send(embed)

    client.members.push(message.guild.id, embed, `${member.id}.punishments`)
    client.settings.push(message.guild.id, embed, 'cases')

    let dm = await member.send(embed.setTitle('You have been muted!')).catch(() => {})
    if (!dm) message.channel.send(new client.embed().setDescription(`Damn no getting them mad.. their dms are locked.`))
}