const db = require("quick.db");

module.exports = {
  name: "leaderboard",
  category: "info",
  description: "View Leaderboard",
  permissions: [],
  cooldown: 0,
  aliases: ["baltop", "lvltop", "top"],
  usage: "leaderboard",
};

module.exports.run = async (client, message) => {
  let until = db.fetch(`untilVote_${message.guild.id}`) || Date.now(),
    timeout = 86400000 - (Date.now() - until),
    parsed = client.utils.formatTime(timeout);

  const leaderboards = [
      {
        label: "Economy",
        emoji: "💵",
        embed: client
          .embedBuilder(
            client,
            message,
            "",
            client.utils.lbMoney(client, message)
          )
          .setAuthor("Economy Leaderboard", `https://i.imgur.com/iaQBPKj.png`),
      },
      {
        label: "Level",
        emoji: "⭐",
        embed: client
          .embedBuilder(
            client,
            message,
            "",
            client.utils.lbContent(client, message, "level")
          )
          .setAuthor("Level Leaderboard", `https://i.imgur.com/urqA2vZ.png`),
      },
      {
        label: "Bumps",
        emoji: "📊",
        embed: client
          .embedBuilder(
            client,
            message,
            "",
            client.utils.lbContent(client, message, "bumps")
          )
          .setAuthor(
            "Bump Leaderboard",
            `https://cdn.upload.systems/uploads/pVry3Mav.png`
          ),
      },
      {
        label: "Votes",
        emoji: "📝",
        embed: client
          .embedBuilder(
            client,
            message,
            "",
            client.utils.lbVotes(client, message)
          )
          .setFooter(`This page is going to update in ${parsed}.`),
      }.setAuthor(
        "Voting Leaderboard",
        `https://cdn.upload.systems/uploads/U5K71mCE.png`
      ),
    ],
    data = [];

  for (let i = 0; i < leaderboards.length; i++) {
    data.push({
      label: leaderboards[i].label,
      value: "val_" + leaderboards[i].label.toLowerCase(),
      emoji: leaderboards[i].emoji,
      embed: leaderboards[i].embed,
    });
  }

  client.paginateSelect(
    client,
    message,
    leaderboards[0].embed,
    {
      id: "leaderboard",
      placeholder: "Select Leaderboard you want to see.",
      options: data,
    },
    true
  );
};
