const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "rank",
  category: "info",
  description: "View your total xp earned on the server.",
  permissions: [],
  cooldown: 0,
  aliases: ["xp"],
  usage: "rank [@user]",
  slash: true,
  options: [
    {
      name: "user",
      description: "User whoes rank to see",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  let user =
    message.mentions.users.first() ||
    client.users.cache.get(args[0]) ||
    message.author;

  let level = (await db.get(`level_${message.guild.id}_${user.id}`)) || 1;
  let xp = (await db.get(`xp_${message.guild.id}_${user.id}`)) || 1;
  let xpNeeded = (parseInt(level) + 1) * 2 * 250 + 250;
  let every = (await db.all())
    .filter((i) => i.id.startsWith(`level_${message.guild.id}_`))
    .sort((a, b) => b.value - a.value);

  let rank =
    (every.map((x) => x.id).indexOf(`level_${message.guild.id}_${user.id}`) +
      1) || 1;

  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705>Rank: **${rank}.**
<:ArrowRightGray:813815804768026705>Level: **${level}**
<:ArrowRightGray:813815804768026705>XP: **${xp}/${xpNeeded}**`
            .replace("1.", "🥇")
            .replace("2.", "🥈")
            .replace("3.", "🥉"),
          "#60b8ff"
        )
        .setAuthor({
          name: user.username + "'s Rank",
          iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
        }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  let user = interaction.options.getUser("user") || interaction.user;

  let level = (await db.get(`level_${interaction.guild.id}_${user.id}`)) || 1;
  let xp = (await db.get(`xp_${interaction.guild.id}_${user.id}`)) || 1;
  let xpNeeded = (parseInt(level) + 1) * 2 * 250 + 250;
  let every = (await db.all())
    .filter((i) => i.id.startsWith(`level_${interaction.guild.id}_`))
    .sort((a, b) => b.value - a.value);

  let rank =
    (every.map((x) => x.id).indexOf(`level_${interaction.guild.id}_${user.id}`) +
      1) || 1;

  interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          "",
          `<:ArrowRightGray:813815804768026705>Rank: **${rank}.**
<:ArrowRightGray:813815804768026705>Level: **${level}**
<:ArrowRightGray:813815804768026705>XP: **${xp}/${xpNeeded}**`
            .replace("1.", "🥇")
            .replace("2.", "🥈")
            .replace("3.", "🥉"),
          "#60b8ff"
        )
        .setAuthor({
          name: user.username + "'s Rank",
          iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
        }),
    ],
  });
};
