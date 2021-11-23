module.exports = {
  name: 'unban',
  category: 'moderation',
  description: 'Allows you to unban a member from the guild.',
  permissions: ["BAN_MEMBERS"],
  cooldown: 0,
  aliases: [`uban`],
  usage: 'unban <Member>'
}

module.exports.run = async(client, message, args) => {
  const reason = args.slice(1).join(' ') || 'No Reason Specified'
  const member = args[0]

  if (!member || isNaN(member)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You need to enter valid user id.`, "RED")] });

  message.guild.members.unban(member).then(() => {
    let embed = client.embedBuilder(client, message, "User UnBanned", `<@!${member}> have been unbanned by ${message.author}`);
    message.channel.send({ embeds: [embed] })
    
    client.utils.logs(client, message.guild, "User UnBanned", [{
      name: "User",
      desc: `<@!${member}>`
    },{
      name: "Staff",
      desc: message.author
    },{
      name: "Reason",
      desc: reason
    }], message.author);
  }).catch(() => {
      return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `That User isn't banned from server.`, "RED")] });
  })
}
