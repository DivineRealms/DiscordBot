const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "leaderboard",
  category: "info",
  description: "View Leaderboard",
  permissions: [],
  cooldown: 0,
  aliases: ["baltop", "lvltop", "top"],
  usage: "leaderboard",
  slash: true,
};

module.exports.run = async (client, message) => {
  let until = (await db.get(`untilVote_${message.guild.id}`)) || Date.now(),
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
            ? await client.utils.lbMoney(client, message)
            : i == 3
            ? `Page updating in **\`${parsed}\`**.\n\n` +
              (await client.utils.lbVotes(client, message))
            : await client.utils.lbContent(
                client,
                message,
                leaderboards[i].label.toLowerCase()
              ),
          `${leaderboards[i].color}`
        )
        .setAuthor({
          name: `${leaderboards[i].label}`,
          iconURL: leaderboards[i].avatar,
        }),
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

module.exports.slashRun = async (client, interaction) => {
  let until = (await db.get(`untilVote_${interaction.guild.id}`)) || Date.now(),
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
          interaction,
          "",
          i == 0
            ? await client.utils.lbMoney(client, interaction)
            : i == 3
            ? `Page updating in **\`${parsed}\`**.\n\n` +
              (await client.utils.lbVotes(client, interaction))
            : await client.utils.lbContent(
                client,
                interaction,
                leaderboards[i].label.toLowerCase()
              ),
          `${leaderboards[i].color}`
        )
        .setAuthor({
          name: `${leaderboards[i].label}`,
          iconURL: leaderboards[i].avatar,
        }),
    });
  }

  client.paginateSelect(
    client,
    interaction,
    data[0].embed,
    {
      id: "leaderboard",
      placeholder: "Select Leaderboard you want to see.",
      options: data,
    },
    true
  );
};
