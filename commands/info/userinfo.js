const moment = require("moment");

module.exports = {
  name: 'userinfo',
  category: 'info',
  description: 'Allows you to view information on a user!',
  permissions: [],
  cooldown: 0,
  aliases: ['whois', 'uinfo'],
  usage: 'userinfo <@User>'
}

module.exports.run = async(client, message, args) => {
  const member = message.mentions.members.first() || client.users.cache.get(args[0]) || message.member;

  const nickname = member.nickname || "*No Nickname!*";

  const accountCreated = moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY");
  const JoinedDate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY");

  const avatar =
    member.user.displayAvatarURL({
      dynamic: true,
      size: 4096,
    }) || "*No Avatar!*";

  const bot = member.user.bot ? "Yes" : "No";

  const roles = [...member.roles.cache.values()].length
  ? [...member.roles.cache.values()]
    .filter((role) => role.name !== "@everyone")
    .join(", ")
  : "*None*";
  const highestRole = member.roles.highest || "*None*";
  const hoistRole = member.roles.hoist || "*None*";

  let embed = client.embedBuilder(client, message, member.user.tag)
    .addField("Nickname", nickname, true)
    .addField("Account Creation", `${accountCreated}`, true)
    .addField("Join Date", `${JoinedDate}`, true)
    .addField("Avatar", `[Click Here!](${avatar})`, true)
    .addField("Highest Role", `${highestRole}`, true)
    .addField("Hoist Role", `${hoistRole}`, true)
    .addField("Bot", `${bot}`, true)
    .addField("ID", `${member.id}`, true)
    .addField("Roles", `${roles}`, true)
    .setThumbnail(avatar)

  message.channel.send({ embeds: [embed] });
}