module.exports = {
  name: "give-role",
  category: "moderation",
  description: "Lets you give a certain role to a member.",
  permissions: ["ManageRolesROLES"],
  cooldown: 0,
  aliases: ["giver", "giverole"],
  usage: "give-role <@User | ID> <@Role | ID | Name>",
};

module.exports.run = async (client, message, args) => {
  const member =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);

  const role =
    message.mentions.roles.first() ||
    message.guild.roles.cache.find((r) =>
      [r.name, r.id].includes(args.slice(1).join(" "))
    );

  let embed = client.utils.errorEmbed(
    client,
    message,
    `Invalid arguments, see ${message.px}help give-role.`
  );

  if (!member) return message.channel.send({ embeds: [embed] });
  if (!role) return message.channel.send({ embeds: [embed] });

  if (member.roles.highest.position >= message.member.roles.highest.position)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "They have higher roles than you."
        ),
      ],
    });

  if (member.roles.highest.position >= message.guild.me.roles.highest.position)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "They have a higher role than me."
        ),
      ],
    });

  if (member.roles.cache.has(role.id))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "They already have that role."
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor({
          name: `Successfully added the ${role.name} role to ${member.user.username}.`,
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
        }),
    ],
  });

  return member.roles.remove(role).catch((_err) => {
    client.utils.errorEmbed(client, message, "Cannot add a role to that user.");
  });
};
