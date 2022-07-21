module.exports = {
  name: "remove-role",
  category: "moderation",
  description: "Lets you revoke a certain role from a member.",
  permissions: ["ManageRolesROLES"],
  cooldown: 0,
  aliases: ["remover", "removerole"],
  usage: "remove-role <@User | ID> <@Role | ID | Name>",
};

module.exports.run = async (client, message, args) => {
  const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]),
    role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.find((r) =>
        [r.name, r.id].includes(args.slice(1).join(" "))
      );

  if (!member || !role)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `Invalid arguments, see ${message.px}help remove-role.`
        ),
      ],
    });

  if (member.roles.highest.position >= message.member.roles.highest.position)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "That Member has higher roles than you."
        ),
      ],
    });

  if (member.roles.highest.position >= message.guild.me.roles.highest.position)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "That Member has higher roles than me."
        ),
      ],
    });

  if (!member.roles.cache.has(role.id))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "That Member don't have that role."
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor({
          name: `Successfully removed role ${role} from ${member.username}.`,
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
        }),
    ],
  });

  return member.roles.remove(role).catch((err) => {
    message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Cannot remove a role from that user."
        ),
      ],
    });
  });
};
