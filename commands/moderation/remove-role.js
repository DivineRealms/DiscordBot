module.exports = {
  name: 'remove-role',
  category: 'moderation',
  description: 'Lets you revoke a certain role from a member.',
  permissions: ["MANAGE_ROLES"],
  cooldown: 0,
  aliases: ['remover', 'removerole'],
  usage: 'remove-role <@User | ID> <@Role | ID | Name>'
}

module.exports.run = async(client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => [r.name, r.id].includes(args.slice(1).join(' ')))

  if (!member || !role) return message.channel.send({ embeds: [client.embedBuilder(client, message, "You need to provide User & Role.", "", "error")] });
  if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({ embeds: [client.embedBuilder(client, message, "That Member has higher roles than you.", "", "error")] });
  if (member.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send({ embeds: [client.embedBuilder(client, message, "That Member has higher roles than me.", "", "error")] });
  if (!member.roles.cache.has(role.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "That Member don't have that role.", "", "error")] });

  message.channel.send({ embeds: [client.embedBuilder(client, message, "Remove Role", `Successfully removed role ${role} from ${member}.`)] });

  return member.roles.remove(role).catch((err) => {
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Cannot remove role from that user.", "", "error")] });
  })
}
