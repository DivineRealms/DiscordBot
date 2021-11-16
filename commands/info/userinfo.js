const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    description: 'Allows you to view information on a user!',
    aliases: ['whois', 'uinfo'],
    usage: 'userinfo <@User>'
}

module.exports.run = async(client, message, args) => {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.find((u) => u.id === args[0]) ||
            message.member;

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

  const roles = member.roles.cache.array().length
    ? member.roles.cache
        .array()
        .filter((role) => role.name !== "@everyone")
        .join(", ")
    : "*None*";
  const highestRole = member.roles.highest || "*None*";
  const hoistRole = member.roles.hoist || "*None*";


  const embed = new client.embed()
    .setTitle(member.user.tag)
    .setThumbnail(avatar)
    .setFooter(`Requested By ${message.author.tag}  |  Made By Fuel#2649`, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .addFields(
      {
        name: "**Nickname**",
        value: nickname,
        inline: true,
        name: "**Account Creation:**",
        value: accountCreated,
        inline: true,
      },
      {
        name: "**Joined Server On:**",
        value: JoinedDate,
        inline: true,
      },
      {
        name: "**Avatar:**",
        value: `[Click Here!](${avatar})`,
        inline: true,
      },
      {
      name: "**Highest Role:**",
      value: highestRole,
      inline: true,
    },
    {
      name: "**Hoist Role:**",
      value: hoistRole,
      inline: true,
    },
    {
        name: "**Bot:**",
        value: bot,
        inline: true,
      },
      {
        name: "**ID:**",
        value: member.user.id,
        inline: true,
      },
      {
        name: "**Status:**",
        value: activities.status,
        inline: true,
      },
      {
        name: "**Activities**",
        value:
          activities.other && activities.other.length
            ? activities.other.join("\n")
            : "*None*",
        inline: true,
        name: "**Roles:**",
        value: roles,
        inline: true,
      }
    );


  message.channel.send(embed);
}