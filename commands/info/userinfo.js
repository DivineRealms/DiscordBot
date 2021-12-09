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
    message.member;
  let nickname = member.nickname || "None";
  let avatar =
    member.user.displayAvatarURL({
      dynamic: true,
      size: 4096,
    }) || "*No Avatar!*";
  let bot = member.user.bot ? "Yes" : "No";
  let roles = [...member.roles.cache.values()].length
    ? [...member.roles.cache.values()]
        .filter((role) => role.name !== "@everyone")
        .join(", ")
    : "*None*";
  let highestRole = member.roles.highest || "*None*";
  let hoistRole = member.roles.hoist || "*None*";

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
<:ArrowRightGray:813815804768026705>Roles: ${roles}`,
          "#60b8ff"
        )
        .setAuthor(
          member.user.username + "'s Information",
          `https://cdn.upload.systems/uploads/6uDK0XAN.png`
        )
        .setThumbnail(
          member.user.displayAvatarURL({ size: 1024, dynamic: true })
        ),
    ],
  });
};
