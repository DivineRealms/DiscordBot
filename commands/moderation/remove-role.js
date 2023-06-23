const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "remove-role",
  category: "moderation",
  description: "Lets you revoke a certain role from a member.",
  permissions: ["ManageRoles"],
  cooldown: 0,
  aliases: ["remover", "removerole"],
  usage: "remove-role <@User | ID> <@Role | ID | Name>",
  slash: true,
  options: [
    {
      name: "user",
      description: "User which to remove role",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "role",
      description: "Role to remove",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
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
          `Invalid arguments, see ${client.conf.Settings.Prefix}help remove-role.`
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
          "That Member doesn't have that role."
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
        name: `Successfully removed role ${role.name} from ${member.user.username}.`,
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ],
  });

  return member.roles.remove(role).catch((_err) => {
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

module.exports.slashRun = async (client, interaction) => {
  const member = interaction.options.getMember("user");
  const role = interaction.options.getRole("role");

  if (
    member.roles.highest.position >= interaction.member.roles.highest.position
  )
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "That Member has higher roles than you."
        ),
      ],
      ephemeral: true,
    });

  if (
    member.roles.highest.position >=
    interaction.guild.members.me.roles.highest.position
  )
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "That Member has higher roles than me."
        ),
      ],
      ephemeral: true,
    });

  if (!member.roles.cache.has(role.id))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "That Member doesn't have that role."
        ),
      ],
      ephemeral: true,
    });

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
        name: `Successfully removed role ${role.name} from ${member.user.username}.`,
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ],
  });

  return member.roles.remove(role).catch((_err) => {
    interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Cannot remove a role from that user."
        ),
      ],
      ephemeral: true,
    });
  });
};
