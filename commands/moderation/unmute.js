module.exports = {
    name: 'unmute',
    category: 'moderation',
    description: 'Lets you unmute the requested user.',
    permissions: ["MUTE_MEMBERS"],
    cooldown: 0,
    aliases: ['um'],
    usage: 'unmute <@User> [reason]'
}

module.exports.run = async(client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    const muterole = message.guild.roles.cache.get(client.conf.moderation.Mute_Role)
    const reason = args.slice(1).join(' ') || 'No Reason Specified'
    if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter valid user.", "RED")] });
    if (!muterole) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "I cannot find mute role.", "RED")] });
    if (member.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot unmute yourself.", "RED")] });
    if (member.user.bot) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot unmute bot.", "RED")] });
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That Member has higher roles than you.", "RED")] });
    if (member.permissions.has('ADMINISTRATOR') || member.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "I can't unmute that member.", "RED")] });
    if (!member.roles.cache.has(muterole.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That Member is already muted.", "RED")] });

    if (Timeout.exists(`mute_${message.guild.id}_${member.id}`)) Timeout.clear(`mute_${message.guild.id}_${member.id}`);
    let mutetime = await db.fetch(`muteInfo_${message.guild.id}_${member.id}`);
    if (mutetime !== null) {
        db.delete(`muteInfo_${message.guild.id}_${member.id}`);
    }
    await member.roles.remove(muterole)
    let embed = client.embedBuilder(client, message, "User UnMuted", `${member.user} have been unmuted by ${message.author}`);

    client.utils.logs(client, message.guild, "User UnMuted", [{
        name: "User",
        desc: member.user
    },{
        name: "Staff",
        desc: message.author
    },{
        name: "Reason",
        desc: reason
    }], member.user);

    await message.channel.send({ embeds: [embed] })

}
