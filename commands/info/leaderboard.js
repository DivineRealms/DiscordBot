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
    timeout = 7200000 - (Date.now() - until),
    parsed = client.utils.formatTime(timeout),
    data = [];

  const leaderboards = [
    {
      label: "Economy",
      emoji: "💵",
      color: "#47a047",
      avatar: `https://cdn.upload.systems/uploads/LrdB6F1N.png`,
    },
    {
      label: "Level",
      emoji: "⭐",
      color: "#f2d422",
      avatar: `https://cdn.upload.systems/uploads/JOATppQ3.png`,
    },
    {
      label: "Bumps",
      emoji: "📊",
      color: "#1cc0f9",
      avatar: `https://cdn.upload.systems/uploads/pVry3Mav.png`,
    },
    {
      label: "Votes",
      emoji: "📝",
      color: "#8ee26b",
      avatar: `https://cdn.upload.systems/uploads/U5K71mCE.png`,
    },
  ];

  for (let i = 0; i < leaderboards.length; i++) {
    data.push({
      label: leaderboards[i].label,
      value: "val_" + leaderboards[i].label.toLowerCase(),
      emoji: leaderboards[i].emoji,
      embed: client
        .embedBuilder(
          client,
          message,
          "",
          i == 0
            ? client.utils.lbMoney(client, message)
            : i == 3
            ? `Page updating in **\`${parsed}\`**.\n\n` +
              client.utils.lbVotes(client, message)
            : client.utils.lbContent(
                client,
                message,
                leaderboards[i].label.toLowerCase()
              ),
          `${leaderboards[i].color}`
        )
        .setAuthor(`${leaderboards[i].label}`, leaderboards[i].avatar),
    });
  }

  client.paginateSelect(
    client,
    message,
    data[0].embed,
    {
      id: "leaderboard",
      placeholder: "Select Leaderboard you want to see.",
      options: data,
    },
    true
  );
};
