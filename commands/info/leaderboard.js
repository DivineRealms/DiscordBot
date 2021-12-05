const db = require("quick.db");

module.exports = {
  name: 'leaderboard',
  category: 'info',
  description: 'View Leaderboard',
  permissions: [],
  cooldown: 0,
  aliases: ['baltop', 'lvltop', 'top'],
  usage: 'leaderboard'
}

module.exports.run = async (client, message) => {
  let until = db.fetch(`untilVote_${message.guild.id}`) || Date.now();
  let timeout = 86400000 - (Date.now() - until);
  let parsed = client.utils.formatTime(timeout);
  
  const leaderboards = [{
    label: "Economy", emoji: "💵",
    embed: client.embedBuilder(client, message, "💵︲Economy Leaderboard", client.utils.lbMoney(client, message))
  }, {
    label: "Level", emoji: "⭐",
    embed: client.embedBuilder(client, message, "⭐︲Level Leaderboard", client.utils.lbContent(client, message, "level"))
  }, {
    label: "Bumps", emoji: "📊",
    embed: client.embedBuilder(client, message, "📊︲Bump Leaderboard", client.utils.lbContent(client, message, "bumps"))
  }, {
    label: "Votes", emoji: "📝",
    embed: client.embedBuilder(client, message, "📝︲Voting Leaderboard", client.utils.lbVotes(client, message)).setFooter(`Next Refresh in ${parsed}`, client.user.displayAvatarURL())
  }], data = [];

  for (let i = 0; i < leaderboards.length; i++) {
    data.push({
      label: leaderboards[i].label,
      value: "val_" + leaderboards[i].label.toLowerCase(),
      emoji: leaderboards[i].emoji,
      embed: leaderboards[i].embed,
    })
  }

  client.paginateSelect(client, message, leaderboards[0].embed, {
    id: "leaderboard",
    placeholder: "Select Leaderboard you want to see.",
    options: data
  }, true);
}