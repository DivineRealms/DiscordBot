const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "roleinfo",
  category: "info",
  description: "Allows you to view information on a role.",
  permissions: [],
  cooldown: 0,
  aliases: ["roleinformation", "ri"],
  usage: "roleinfo <@Role>",
};

module.exports.run = async (client, message) => {
  let role = message.mentions.roles.first();
  if (!role)
    return message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Error",
          "You need to mention role.",
          "error"
        ),
      ],
    });

  let embed = client.embedBuilder(
    client,
    message,
    `${role.name} Role Information`,
    `<:ArrowRightGray:813815804768026705>Created: <t:${Math.round(
      role.createdTimestamp / 1000
    )}:R>
<:ArrowRightGray:813815804768026705>ID: \`${role.id}\`
<:ArrowRightGray:813815804768026705>Position: **${role.position}**
<:ArrowRightGray:813815804768026705>Color: \`${role.hexColor}\`
<:ArrowRightGray:813815804768026705>Hoisted: **${role.hoist}**`
  );

  message.channel.send({ embeds: [embed] });
};
