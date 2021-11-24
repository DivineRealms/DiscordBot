module.exports = {
  name: 'kick',
  category: 'moderation',
  description: 'Kicks the requested member from the server.',
  permissions: ["KICK_MEMBERS"],
  cooldown: 0,
  aliases: [`forcekick`],
  usage: 'kick <@user | ID> <Reason>'
}

module.exports.run = async(client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

  if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide user to kick.", "RED")] });
  if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That User couldn't be found.", "RED")] });
  if (member.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot kick yourself.", "RED")] });
  if (!member.kickable) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That User cannot be kicked.", "RED")] });

  const reason = args.slice(1).join(" ") || 'No Reason'
  let embed = client.embedBuilder(client, message, "User Kicked", `${member.user} has been kicked by ${message.author} for \`${reason}\``);

  await member.kick(reason);

  client.utils.logs(client, message.guild, "User Kicked", [{
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
    desc: "N/A"
  }], member.user);

  await message.channel.send({ embeds: [embed] })
}
