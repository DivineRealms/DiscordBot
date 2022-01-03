const db = require("quick.db");

module.exports = {
  name: "rank",
  category: "info",
  description: "View your total xp earned on the server.",
  permissions: [],
  cooldown: 0,
  aliases: ["xp"],
  usage: "rank [@user]",
};

module.exports.run = async (client, message, args) => {
  let user =
    message.mentions.users.first() ||
    client.users.cache.get(args[0]) ||
    message.author;

  let level = db.fetch(`level_${message.guild.id}_${user.id}`) || 1;
  let xp = db.fetch(`xp_${message.guild.id}_${user.id}`) || 1;
  let xpNeeded = (parseInt(level) + 1) * 2 * 250 + 250;
  let every = db
    .all()
    .filter((i) => i.ID.startsWith(`level_${message.guild.id}_`))
    .sort((a, b) => b.data - a.data);

  let rank =
    every.map((x) => x.ID).indexOf(`level_${message.guild.id}_${user.id}`) +
      1 || 1;

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
          iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`
        }),
    ],
  });
};
