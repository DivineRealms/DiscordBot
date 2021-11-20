module.exports = {
    name: 'unban',
    description: 'Allows you to unban a member from the guild.',
    permissions: ["BAN_MEMBERS"],
    cooldown: 0,
    aliases: [`uban`],
    usage: 'unban <Member>'
}

module.exports.run = async(client, message, args) => {
    let channel = message.guild.channels.cache.get(client.conf.logging.Ban_Channel_Logs)
    let embed = new client.embed()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    const reason = args.slice(1).join(' ') || 'No Reason Specified'
    const member = await client.users.fetch(args[0]).catch(() => {})

    if (!member) return message.channel.send(embed.setDescription('Please enter a valid ID!'))

    await message.guild.bans.fetch(args[0]).then(() => {
        client.utils.logs(this.client, message.guild, "User UnBanned", [{
            name: "User",
            desc: member.user
          },{
            name: "Staff",
            desc: message.author
          },{
            name: "Reason",
            desc: reason
          }], member.user);

          let embed = client.embedBuilder(client, message, "User UnBanned", `${member.user} have been unbanned by ${message.author}`, "YELLOW");

        message.channel.send({ embeds: [embed] })
        message.guild.members.unban(args[0], reason).catch(() => {})
    }).catch(() => {
        return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `That User isn't banned from server.`, "RED")] });
    })
}