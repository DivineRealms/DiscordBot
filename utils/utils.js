const Discord = require("discord.js");
const db = require("quick.db");

function formatTime(ms) {
  let roundNumber = ms > 0 ? Math.floor : Math.ceil;
  let days = roundNumber(ms / 86400000),
    hours = roundNumber(ms / 3600000) % 24,
    mins = roundNumber(ms / 60000) % 60,
    secs = roundNumber(ms / 1000) % 60;
  var time = days > 0 ? `${days}d ` : "";
  time += hours > 0 ? `${hours}h ` : "";
  time += mins > 0 ? `${mins}m ` : "";
  time += secs > 0 ? `${secs}s` : "0s";
  return time;
}

function commandsList(client, message, category) {
  let commands = client.commands.filter(
    (c) => c.category == category && c.category != "owner"
  );
  let content = "";

  commands.forEach(
    (c) => (content += `<:ArrowRightGray:813815804768026705>\`${message.px}${c.name}\`︲${c.description}\n`)
  );

  return content;
}

function lbContent(client, message, lbType) {
  let leaderboard = db
    .all()
    .filter((data) => data.ID.startsWith(`${lbType}_${message.guild.id}`))
    .sort((a, b) => b.data - a.data);
  let content = "";

  for (let i = 0; i < leaderboard.length; i++) {
    if (i === 10) break;

    content += `**#${i + 1}** <@!${leaderboard[i].ID.split("_")[2]}> - ${
      leaderboard[i].data
    }\n`;
  }

  return content;
}

function lbVotes(client, message) {
  let leaderboard = db
    .fetch(`votes_${message.guild.id}`)
    .sort((a, b) => b.votes - a.votes);
  let content = "";

  for (let i = 0; i < leaderboard.length; i++) {
    if (i == 10) break;

    content += `**#${i + 1}** ${leaderboard[i].nickname} - ${
      leaderboard[i].votes
    }\n`;
  }

  return content;
}

function lbMoney(client, message) {
  let leaderboard = db
    .all()
    .filter((data) => data.ID.startsWith(`money_${message.guild.id}`))
    .sort((a, b) => b.data - a.data);
  let content = "";
  let data = [];

  for (let i = 0; i < leaderboard.length; i++) {
    if (i === 10) break;

    let bank = db.fetch(
      `bank_${message.guild.id}_${leaderboard[i].ID.split("_")[2]}`
    );
    let total = leaderboard[i].data + bank;

    data.push({
      user: leaderboard[i].ID.split("_")[2],
      money: total,
    });
  }
  data.sort((a, b) => b.money - a.money);

  for (let i = 0; i < data.length; i++) {
    content += `**#${i + 1}** <@!${data[i].user}> - $${data[i].money}\n`;
  }

  return content;
}

module.exports = {
  formatTime,
  commandsList,
  lbContent,
  lbMoney,
  lbVotes,
};
