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
  if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `Sorry, I am missing my required permissions perhaps try moving my role up!`)]})

  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

  if(member) {
    if (member.id == message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot ban yourself.", "RED")] });
    if (!member.bannable) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "I can't ban that user.", "RED")] });
  
    const reason = args.slice(1).join(" ") || 'No Reason'
  
    let embed = client.embedBuilder(client, message, "User Banned", `${member.user} have been banned by ${message.author} for \`${reason}\``);
  
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
  } else if(!isNaN(args[0])) {
    member = args[0]
    if (args[0] === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot ban yourself.", "RED")] });
  
    const reason = args.slice(1).join(" ") || 'No Reason'
  
    let embed = client.embedBuilder(client, message, "User Banned", `<@!${args[0]}> have been banned by ${message.author} for \`${reason}\``);
  
    client.utils.logs(client, message.guild, "User Warned", [{
      name: "User",
      desc: `<@!${args[0]}>`
    },{
      name: "Staff",
      desc: message.author
    },{
      name: "Reason",
      desc: reason
    },{
      name: "Duration",
      desc: "Permanent"
    }], message.author);
  
    message.guild.members.ban(member, { reason })
    await message.channel.send({ embeds: [embed] }) 
  } else {
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide user.", "RED")] });
  }
}
