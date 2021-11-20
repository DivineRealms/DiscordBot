const moment = require("moment");

module.exports = {
    description: 'Allows you to view information on a user!',
    permissions: [],
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
          format: "png",
          dynamic: true,
          size: 4096,
      }) || "*No Avatar!*";

  const bot = member.user.bot ? "Yes" : "No";

  const activities =
      member.user.presence.activities.length === 0 ? {
          status: "*None*",
          other: [],
      } :
      member.user.presence.activities.reduce(
          (activities, activity) => {
              switch (activity.type) {
                  case "CUSTOM_STATUS":
                      activities.status = `${ activity.emoji ? `${activity.emoji} | ` : ""}${activity.state}`; break;case "PLAYING":activities.other.push(`${activity.type} ${activity.name}`);break;case "LISTENING":if (activity.name === "Spotify" && activity.assets) {
            activities.other.push(`${activity.details} by ${activity.state}`);}break;default:activities.other.push(activity.type);}return activities;},{ status: "*None*",other: [],});

  const roles = [...member.roles.values()].length
    ? [...member.roles.values()]
        .filter((role) => role.name !== "@everyone")
        .join(", ")
    : "*None*";
  const highestRole = member.roles.highest || "*None*";
  const hoistRole = member.roles.hoist || "*None*";


  let embed = new client.embed()
    .setTitle(member.user.tag)
    .addField("Nickname", nickname, true)
    .addField("Account Creation", accountCreated, true)
    .addField("Join Date", JoinedDate, true)
    .addField("Avatar", `[Click Here!](${avatar})`, true)
    .addField("Highest Role", highestRole, true)
    .addField("Hoist Role", hoistRole, true)
    .addField("Bot", bot, true)
    .addField("ID", member.id, true)
    .addField("Activities", activities.other && activities.other.length
      ? activities.other.join("\n")
      : "*None*", true)
    .addField("Status", activities.status, true)
    .addField("Roles", roles, true)
    .setThumbnail(avatar)

  message.channel.send({ embeds: [embed] });
}