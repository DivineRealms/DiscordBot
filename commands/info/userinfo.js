const moment = require("moment");

module.exports = {
  name: "userinfo",
  category: "info",
  description: "Allows you to view information on a user!",
  permissions: [],
  cooldown: 0,
  aliases: ["whois", "uinfo"],
  usage: "userinfo <@User>",
};

module.exports.run = async (client, message, args) => {
  const member =
      message.mentions.members.first() ||
      client.users.cache.get(args[0]) ||
      message.member,
    nickname = member.nickname || "None",
    avatar =
      member.user.displayAvatarURL({
        dynamic: true,
        size: 4096,
      }) || "*No Avatar!*",
    bot = member.user.bot ? "Yes" : "No",
    roles = [...member.roles.cache.values()].length
      ? [...member.roles.cache.values()]
          .filter((role) => role.name !== "@everyone")
          .join(", ")
      : "*None*",
    highestRole = member.roles.highest || "*None*",
    hoistRole = member.roles.hoist || "*None*",
    memberColor = message.guild.members.cache.get(member.id).displayHexColor;

  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705>Nickname: \`${nickname}\`
<:ArrowRightGray:813815804768026705>Created <t:${Math.round(
            member.user.createdTimestamp / 1000
          )}:R>, joined <t:${Math.round(member.joinedTimestamp / 1000)}:R>
<:ArrowRightGray:813815804768026705>Avatar: **[click here](${avatar})**
<:ArrowRightGray:813815804768026705>Highest Role: ${highestRole}
<:ArrowRightGray:813815804768026705>Hoisted Role: ${hoistRole}
<:ArrowRightGray:813815804768026705>Bot: **${bot}**
<:ArrowRightGray:813815804768026705>ID: **${member.id}**
<:ArrowRightGray:813815804768026705>Roles: ${roles}`
        )
        .setAuthor(
          member.user.tag,
          member.user.displayAvatarURL({ size: 1024, dynamic: true })
        )
        .setColor(memberColor),
    ],
  });
};
