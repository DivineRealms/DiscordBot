const ms = require("ms");

module.exports = {
    description: 'Lets you mute the requested user.',
    permissions: ["MUTE_MEMBERS"],
    aliases: ['stopspeaking'],
    usage: 'mute <@User> [time | reason] [reason]'
}

module.exports.run = async(client, message, args) => {
    const member = message.mentions.members.first() || message.guild.member(args[0])
    const muterole = message.guild.roles.cache.get(client.conf.moderation.Mute_Role)
    const time = ms(args[1])
    const reason = args.slice(time ? 2 : 1).join(' ') || 'No Reason Provided'

    if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter valid user.", "RED")] });
    if (!muterole) return message.channel.send({ embeds: [new client.embed().setDescription('I cant find the mute role on the server!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (member.id === message.author.id) return message.channel.send({ embeds: [new client.embed().setDescription('Stop being a dumbass... You can\'t mute yourself.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (member.user.bot) return message.channel.send({ embeds: [new client.embed().setDescription('You can\'t mute a bot!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({ embeds: [new client.embed().setDescription('You can only mute members that have a lower role than you.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (member.permissions.has('ADMINISTRATOR') || member.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send({ embeds: [new client.embed().setDescription('I cant mute that member').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (member.roles.cache.has(muterole.id)) return message.channel.send({ embeds: [new client.embed().setDescription('That member is already muted!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    db.set(`muteInfo_${message.guild.id}_${member.id}`, {
        time: time,
        date: Date.now(),
        reason: reason,
        staff: message.author.tag,
        duration: time,
      });
      Timeout.set(`mute_${message.guild.id}_${member.id}`, () => {
        member.roles.remove(muterole).then(() => {
            db.delete(`muteInfo_${message.guild.id}_${member.id}`);
        })
      }, time);

    await member.roles.add(muterole)

    let casenum = db.fetch(`cases_${message.guild.id}`) + 1;
    let embed = client.embedBuilder(client, message, "User Muted", `${member.user} have been muted by ${message.author} for ${reason}, duration ${client.utils.formatTime(time)}`, "YELLOW");

    client.utils.logs(this.client, message.guild, "User Muted", [{
        name: "Case ID",
        desc: `${casenum}`
      },{
        name: "User",
        desc: member.user
      },{
        name: "Staff",
        desc: message.author
      },{
        name: "Reason",
        desc: reason
      },{
        name: "Duration",
        desc: `${client.utils.formatTime(time)}`
      }], member.user);

    await message.channel.send({ embeds: [embed] })

    db.push(`punishments_${message.guild.id}_${member.id}`, embed);
    db.add(`cases_${message.guild.id}`, 1);
}