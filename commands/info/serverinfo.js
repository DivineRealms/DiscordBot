module.exports = {
  name: "serverinfo",
  category: "info",
  description: "Allows you to view information on the server.",
  permissions: [],
  cooldown: 0,
  aliases: ["sinfo", "servinfo"],
  usage: "serverinfo",
};

module.exports.run = async (client, message, args) =>
  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705>Created: <t:${Math.round(
            message.guild.createdTimestamp / 1000
          )}:R>
<:ArrowRightGray:813815804768026705>Guild ID: **${message.guild.id}**
<:ArrowRightGray:813815804768026705>Server Owner: <@!${message.guild.ownerId}>
<:ArrowRightGray:813815804768026705>Channels: **${
            message.guild.channels.cache.size
          }**
<:ArrowRightGray:813815804768026705>Roles: **${message.guild.roles.cache.size}**
<:ArrowRightGray:813815804768026705>Server Boost Tier: **${
            message.guild.premiumTier + 1
          }**
<:ArrowRightGray:813815804768026705>Boost Count: **${
            message.guild.premiumSubscriptionCount || "0"
          }**
<:ArrowRightGray:813815804768026705>Emoji Count: **${
            message.guild.emojis.cache.size
          }**
`
        )
        .setAuthor(
          message.guild.name,
          message.guild.iconURL({ size: 1024, dynamic: true })
        ),
    ],
  });
