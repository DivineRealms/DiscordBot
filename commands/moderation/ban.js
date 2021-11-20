module.exports = {
    name: 'ban',
    category: 'moderation',
    description: 'Lets you ban the requested member from the guild.',
    permissions: ["BAN_MEMBERS"],
    cooldown: 0,
    aliases: ['yeet', 'forceban'],
    usage: 'ban <@user | ID> <Reason>'
}

module.exports.run = async(client, message, args) => {
    if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry, I am missing my required permissions perhaps try moving my role up!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    const member = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => {})

    if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to mention user.", "RED")] });
    if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Couldn't find that user.", "RED")] });
    if (member.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot ban yourself.", "RED")] });
    if (await message.guild.members.fetch(member).catch(() => {}) && !(await message.guild.members.fetch(member).bannable)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "I can't ban that user.", "RED")] });

    const reason = args.slice(1).join(" ") || 'No Reason'

    let embed = client.embedBuilder(client, message, "User Banned", `${member.user} have been banned by ${message.author} for ${reason}`, "YELLOW");

    client.utils.logs(client, message.guild, "User Warned", [{
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
        desc: "Permanent"
      }], member.user);

    message.guild.members.ban(member, { reason })
    await message.channel.send({ embeds: [embed] })
}